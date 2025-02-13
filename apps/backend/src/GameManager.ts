import { WebSocket } from "ws";
import {
  ACCEPT_DRAW,
  DRAW,
  GAME_INITIALIZE,
  GAME_OVER,
  IN_GAME,
  MOVE,
  RESIGN,
  SENDING_DRAW,
} from "./message";
import { Game } from "./Game";
import { User, Match } from "@workspace/types";
// import RedisClient from "@workspace/queue"; // No longer needed with in‑memory debounce
import { Prisma, PrismaClient } from "@workspace/db";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable Prisma query logging
});

if (!prisma.$connect) {
  console.log("Connection to the database failed");
}

export default class GameHandler {
  private games: Game[];
  private users: { socket: WebSocket; user: User }[];
  private socketsMap: Map<string, WebSocket>;
  // New properties for debounced matchmaking:
  private pendingQueue: { socket: WebSocket; user: User }[];
  private matchDebounceTimer: NodeJS.Timeout | null;

  constructor() {
    this.games = [];
    this.users = [];
    this.socketsMap = new Map();
    this.pendingQueue = [];
    this.matchDebounceTimer = null;
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
    // Also remove from the pending queue if present
    this.pendingQueue = this.pendingQueue.filter((p) => p.socket !== socket);
    console.log(`User removed: ${userId}`);
  }

  private addHandler({ socket, user }: { socket: WebSocket; user: User }) {
    socket.on("message", async (data) => {
      console.log("Received message:", data.toString());
      const message = JSON.parse(data.toString());

      if (message.type === GAME_INITIALIZE) {
        // Instead of immediately trying to match via Redis,
        // we add the user to a pending queue and schedule debounced matchmaking.
        this.pendingQueue.push({ socket, user });
        // Clear any existing timer so that we always wait for 200ms after the last arrival
        if (this.matchDebounceTimer) {
          clearTimeout(this.matchDebounceTimer);
        }
        this.matchDebounceTimer = setTimeout(() => {
          this.matchPlayers();
          this.matchDebounceTimer = null;
        }, 200); // 200ms debounce delay – adjust as needed
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
        const player1 = game?.player1;
        const player2 = game?.player2;
        if (message.payload === SENDING_DRAW) {
          if (player1?.socket === socket) {
            player2?.socket.send(JSON.stringify({ type: DRAW, payload: SENDING_DRAW }));
          } else {
            player1?.socket.send(JSON.stringify({ type: DRAW, payload: SENDING_DRAW }));
          }
        } else if (message.payload === ACCEPT_DRAW) {
          await game?.gameComplete("draw");
          player1?.socket.send(JSON.stringify({ type: GAME_OVER, payload: { draw: true } }));
          player2?.socket.send(JSON.stringify({ type: GAME_OVER, payload: { draw: true } }));
        }
      }
      if (message.type === RESIGN) {
        const game = this.games.find(
          (game) => game.player1.socket === socket || game.player2.socket === socket
        );
        const player1 = game?.player1;
        const player2 = game?.player2;
        const winningPlayer = player1?.socket === socket ? player2?.user : player1?.user;
        await game?.gameComplete(player1?.socket === socket ? "black" : "white");
        player2?.socket.send(
          JSON.stringify({ type: GAME_OVER, payload: { user: winningPlayer, method: RESIGN } })
        );
        player1?.socket.send(
          JSON.stringify({ type: GAME_OVER, payload: { user: winningPlayer, method: RESIGN } })
        );
      }
    });

    socket.on("close", () => {
      this.removeUser(socket);
    });
  }

  /**
   * This method checks the pendingQueue and matches players pairwise.
   * If at least two players are waiting, it creates a new game for them.
   * If one player remains, it notifies that player they are still waiting.
   */
  private async matchPlayers() {
    while (this.pendingQueue.length >= 2) {
      const player1 = this.pendingQueue.shift()!;
      const player2 = this.pendingQueue.shift()!;

      let newGame;
      try {
        newGame = await prisma.$transaction(async (tx) => {
          return await tx.match.create({
            data: {
              player1: { connect: { id: player1.user.id } },
              player2: { connect: { id: player2.user.id } },
              time: 10,
              AddedTime: 0,
              result: "PLAYING",
            },
          });
        });
        console.log("Game created:", newGame);
      } catch (error) {
        console.error("Error creating game:", error);
        // If an error occurs, you might want to re-add the players to the queue.
        continue;
      }

      if (newGame) {
        // Create a new game instance and add it to the games list.
        const game = new Game(player1, player2, newGame.id, false);
        this.games.push(game);
        const payload = JSON.stringify({
          type: GAME_INITIALIZE,
          payload: {
            game: {
              player1: player1.user,
              player2: player2.user,
              id: newGame.id,
              time: newGame.time,
              AddedTime: newGame.AddedTime,
            },
          },
        });
        player1.socket.send(payload);
        player2.socket.send(payload);
        // Optionally, remove these users from the socket map if you no longer need them there.
        this.socketsMap.delete(player1.user.id);
        this.socketsMap.delete(player2.user.id);
      }
  }

    // If one player is still waiting, let them know they're still in the queue.
    if (this.pendingQueue.length === 1) {
      const waitingPlayer = this.pendingQueue[0];
      waitingPlayer &&
      waitingPlayer.socket.send(
        JSON.stringify({
          type: GAME_INITIALIZE,
          payload: { game: { player1: waitingPlayer.user, player2: null } },
        })
      );
    }
  }
}
