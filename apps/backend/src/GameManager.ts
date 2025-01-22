import { WebSocket } from "ws";
import { GAME_INITIALIZE, MOVE } from "./message";
import { Game } from "./Game";
import { User,Match } from '@workspace/types'
import jwt from 'jsonwebtoken'
import RedisClient from '@workspace/queue'
import { PrismaClient } from '@workspace/db'
 


const prisma = new PrismaClient();
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

        this.users.push({ socket, user })
        this.addHandler({ socket, user });
        
    }
    removeUser(socket: WebSocket) {
        this.users = this.users.filter(u => u.socket !== socket);

    }
    async getPendingUser() {
        try {
            const pending_Users = await redis.brPop('pending_users', 10);
            if (pending_Users) {
                const user = JSON.parse(pending_Users.element);
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
            return []

        }

    }
    private addHandler({ socket, user }: {
        socket: WebSocket,
        user: User
    }) {
        socket.on('message', async (data) => {
            console.log('Received:', data.toString());
            const message = JSON.parse(data.toString());
            if (message.type === GAME_INITIALIZE) {
                const pendingUser = await this.getPendingUser() as {  user: User, game: string };
                if (pendingUser) {
                  
                    await prisma.$transaction(async (tx) => {
                        try {
                            const updateGame = await tx.match.update({
                                where: {
                                    id: pendingUser.game
                                },
                                data: {
                                    player2: {
                                        connect: {
                                            id: user.id
                                        }
                                    },
                                    result:"PLAYING"
                                }
                            })
                            if (updateGame) {
                                const pendingUserSocket = this.socketsMap.get(pendingUser.user.id);
                                if (!pendingUserSocket) {
                                    console.log(`Socket not found for user: ${pendingUser.user.id}`);
                                    return;
                                }
                                const game = new Game({ socket: pendingUserSocket, user: pendingUser.user }, { socket, user }, pendingUser.game);
                                this.games.push(game);
                                socket.send(JSON.stringify({
                                    type:GAME_INITIALIZE,
                                    payload:{
                                        game:{
                                            player1:pendingUser.user,
                                            player2:user,
                                            id:pendingUser.game
                                        }
                                    }
                                }))
                                this.socketsMap.delete(pendingUser.user.id);
                            }
                        } catch (error) {
                            console.log(error)
                            return;


                        }

                    })

                } else {
                    // Create a new game
                    await prisma.$transaction(async (tx) => {
                        try {
                            const newGame = await tx.match.create({
                                data: {
                                    player1: {
                                        connect: {
                                            id: user.id
                                        }
                                    },
                                    result:"NOT_PLAYED",
                                    time: 10,
                                    AddedTime:0,

                                

                                }
                            })
                            await redis.lPush('pending_users',JSON.stringify({user,game:newGame.id}))
                            this.socketsMap.set(user.id, socket);
                            
                            
                        } catch (error) {
                            console.log(error)
                            return;

                        }

                    })
                }


            }
            if (message.type === MOVE) {
                const game = this.games.find((game) => game.player1.socket === socket || game.player2)
                if (game) {
                    game.makeMove(socket, message.move)
                }
            }
        })
    }

}