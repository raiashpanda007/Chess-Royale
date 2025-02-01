import { WebSocket } from "ws";
import { ACCEPT_DRAW, DRAW, GAME_INITIALIZE, GAME_OVER, IN_GAME, MOVE, RESIGN, SENDING_DRAW } from "./message";
import { Game } from "./Game";
import { User, Match } from "@workspace/types";
import RedisClient from "@workspace/queue";
import { PrismaClient } from "@workspace/db";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable Prisma query logging
});

if (!prisma.$connect) {
  console.log("Connection to the database failed");
}
const redis = RedisClient.getInstance().getClient();

export default class GameHandler {
  private games: Game[];
  private users: { socket: WebSocket; user: User }[];
  private socketsMap: Map<string, WebSocket>;

  constructor() {
    this.games = [];
    this.users = [];
    this.socketsMap = new Map();
  }

  addUser(socket: WebSocket, user: User) {
    console.log("User joined:", user);
    this.users.push({ socket, user });
    this.socketsMap.set(user.id, socket); // Map the user's socket
    this.addHandler({ socket, user });
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((u) => u.socket !== socket);
    const userId = [...this.socketsMap.entries()].find(([_, s]) => s === socket)?.[0];
    if (userId) {
      this.socketsMap.delete(userId);
    }
    console.log(`User removed: ${userId}`);
  }

  private async getPendingUser() {
    try {
      const pendingUsers = await redis.brPop("pending_users", 10); // Timeout of 10 seconds
      if (pendingUsers) {
        return JSON.parse(pendingUsers.element);
      }
      return null; // No pending user found
    } catch (error) {
      console.error("Error fetching pending user from Redis:", error);
      return null;
    }
  }

  private async addToQueue(user: User) {
    try {
      const existingEntries = await redis.lRange("pending_users", 0, -1);
      const isUserAlreadyInQueue = existingEntries.some((entry) => {
        const queuedUser = JSON.parse(entry);
        return queuedUser.user.id === user.id;
      });

      if (!isUserAlreadyInQueue) {
        await redis.lPush("pending_users", JSON.stringify({ user }));
        console.log("User added to queue:", user.id);
      } else {
        console.log("User already in queue:", user.id);
        this.socketsMap.get(user.id)?.send(JSON.stringify({ type: IN_GAME }));
      }
    } catch (error) {
      console.error("Error adding user to queue:", error);
    }
  }

  private addHandler({ socket, user }: { socket: WebSocket; user: User }) {
    socket.on("message", async (data) => {
      console.log("Received message:", data.toString());
      const message = JSON.parse(data.toString());

      if (message.type === GAME_INITIALIZE) {
        const pendingUser = await this.getPendingUser();
        console.log("Pending user:", pendingUser);

        if (pendingUser) {
          // Update the match and start the game
          let newGame;
          try {
            newGame = await prisma.$transaction(async (tx) => {
              const match = await tx.match.create({
                data: {
                  player1: {
                    connect: {
                      id: pendingUser.user.id
                    }
                  },
                  player2: {
                    connect: {
                      id: user.id
                    }
                  },
                  time: 10,
                  AddedTime: 0,
                  result: "PLAYING"
                }
              })
              return match;
            })
            console.log("Game updated:", newGame);
          } catch (error) {
            console.error("Error updating game:", error);
            return;
          }

          if (newGame) {
            const pendingUserSocket = this.socketsMap.get(pendingUser.user.id);
            if (!pendingUserSocket) {
              console.error(`Socket not found for pending user: ${pendingUser.user.id}`);
              return;
            }

            // Initialize the game instance
            const game = new Game(
              { socket: pendingUserSocket, user: pendingUser.user },
              { socket, user },
              newGame.id
            );
            this.games.push(game);

            // Notify both players
            pendingUserSocket.send(
              JSON.stringify({
                type: GAME_INITIALIZE,
                payload: {
                  game: {
                    player1: pendingUser.user,
                    player2: user,
                    id: pendingUser.game,
                    time: newGame.time,
                    AddedTime: newGame.AddedTime,
                  },
                },
              })
            );

            socket.send(
              JSON.stringify({
                type: GAME_INITIALIZE,
                payload: {
                  game: {
                    player1: pendingUser.user,
                    player2: user,
                    id: pendingUser.game,
                    time: newGame.time,
                    AddedTime: newGame.AddedTime
                  },
                },
              })
            );

            // Remove the pending user from the sockets map
            this.socketsMap.delete(pendingUser.user.id);
          }
        } else {
          // No pending user; create a new game


          try {
            // Add the current user to the Redis queue
            await this.addToQueue(user);
            this.socketsMap.set(user.id, socket);

            // Notify the player about the new game
            socket.send(
              JSON.stringify({
                type: GAME_INITIALIZE,
                payload: {
                  game: {
                    player1: user,
                    player2: null,

                  },
                },
              })
            );
          } catch (error) {
            console.error("Error updating Redis or WebSocket:", error);
          }
        }
      }

      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1.socket === socket || game.player2.socket === socket
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
      if (message.type === DRAW) {
        console.log("Draw request received");
        const game = this.games.find(
          (game) => game.player1.socket === socket || game.player2.socket === socket
        );
        const player1 = game?.player1
        const player2 = game?.player2
        if (message.payload === SENDING_DRAW) {
          player1?.socket === socket ? player2?.socket.send(JSON.stringify({
            type: DRAW,
            payload: SENDING_DRAW
          })) : player1?.socket.send(JSON.stringify({
            type: DRAW,
            payload: SENDING_DRAW
          }))
        } else if(message.payload === ACCEPT_DRAW ){
          
          await game?.gameComplete("draw");
          player1?.socket.send(JSON.stringify({
            type:GAME_OVER,
            payload:{
              draw:true
            }
          }))
          player2?.socket.send(JSON.stringify({
            type:GAME_OVER,
            payload:{
              draw:true
            }
          }))
          
        } 


      } 
      if(message.type === RESIGN){
        const game = this.games.find(
          (game) => game.player1.socket === socket || game.player2.socket === socket
        );
        const player1 = game?.player1
        const player2 = game?.player2
        const winingPlayer = player1?.socket === socket ? player2?.user:player1?.user
        await game?.gameComplete(player1?.socket === socket ? "black":"white")
        player2?.socket.send(JSON.stringify({
          type:GAME_OVER,
          payload:{
            user:winingPlayer,
            method:RESIGN
          }
        })) 
        player1?.socket.send(JSON.stringify({
          type:GAME_OVER,
          payload:{
            user:winingPlayer,
            method:RESIGN
          }
        }))
        

      }
    });

    socket.on("close", () => {
      console.log("User disconnected:", user.id);
      this.removeUser(socket);
    });
  }
}
