import { PrismaClient } from "@workspace/db";
import { Game } from "./Game";
import { WebSocket } from "ws";
import { ACCEPT_DRAW, DRAW, GAME_INITIALIZE, GAME_OVER, MOVE, RESIGN, SENDING_DRAW } from "./message";
import { User, Match } from "@workspace/types";

const prisma = new PrismaClient();

export default class TournamentGameHandler {
    private games: Game[];
    private users: { socket: WebSocket; user: User }[];

    constructor() {
        this.games = [];
        this.users = [];
    }

    addUser(socket: WebSocket, user: User, gameID: string) {
        console.log("User joined:", user);
        this.users.push({ socket, user });
        this.addHandler({ socket, user, gameID });
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter((u) => u.socket !== socket);
        console.log("User removed:", socket);
    }

    private addHandler({ socket, user, gameID }: { socket: WebSocket; user: User; gameID: string }) {
        socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === GAME_INITIALIZE) {
                try {
                    const match = await prisma.match.findUnique({
                        where: { id: gameID },
                    });

                    if (!match) {
                        return socket.send(JSON.stringify({ error: "Match not found" }));
                    }

                    if (!match.player1Id || !match.player2Id) {
                        return socket.send(
                            JSON.stringify({
                                type: GAME_OVER,
                                payload: {
                                    user: match.player1Id ? match.player2Id : match.player1Id,
                                    method: RESIGN,
                                },
                            })
                        );
                    }

                    if (match.player1Id !== user.id && match.player2Id !== user.id) {
                        return socket.send(JSON.stringify({ error: "Unauthorized" }));
                    }

                    const player1 = this.users.find((u) => u.user.id === match.player1Id);
                    const player2 = this.users.find((u) => u.user.id === match.player2Id);

                    if (!player1 || !player2) {
                        return socket.send(JSON.stringify({ message: "Waiting for other player" }));
                    }

                    if (!this.games.some((g) => g.id === gameID)) {
                        const game = new Game(player1, player2, gameID);
                        this.games.push(game);
                    }

                    const gamePayload = {
                        type: GAME_INITIALIZE,
                        payload: {
                            game: {
                                player1: player1.user.id,
                                player2: player2.user.id,
                                id: gameID,
                                time: match.time,
                                addedTime: match.AddedTime,
                            },
                        },
                    };

                    player1.socket.send(JSON.stringify(gamePayload));
                    player2.socket.send(JSON.stringify(gamePayload));
                } catch (error) {
                    console.error("Game initialization error:", error);
                    socket.send(JSON.stringify({ error: "Error fetching game" }));
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
                const game = this.games.find(
                    (game) => game.player1.socket === socket || game.player2.socket === socket
                );

                if (game) {
                    const player1 = game.player1;
                    const player2 = game.player2;

                    if (message.payload === SENDING_DRAW) {
                        const opponent = player1.socket === socket ? player2 : player1;
                        opponent.socket.send(JSON.stringify({ type: DRAW, payload: SENDING_DRAW }));
                    } else if (message.payload === ACCEPT_DRAW) {
                        game.gameComplete("draw");
                        player1.socket.send(JSON.stringify({ type: GAME_OVER, payload: { draw: true } }));
                        player2.socket.send(JSON.stringify({ type: GAME_OVER, payload: { draw: true } }));
                    }
                }
            }

            if (message.type === RESIGN) {
                const game = this.games.find(
                    (game) => game.player1.socket === socket || game.player2.socket === socket
                );

                if (game) {
                    const player1 = game.player1;
                    const player2 = game.player2;
                    const loser = player1.socket === socket ? player1 : player2;
                    const winner = player1.socket === socket ? player2 : player1;

                    game.gameComplete(winner.user.id);

                    winner.socket.send(
                        JSON.stringify({
                            type: GAME_OVER,
                            payload: {
                                user: loser.user,
                                method: RESIGN,
                            },
                        })
                    );
                }
            }
        });

        socket.on("close", () => {
            console.log("User disconnected:", user.id);
            this.removeUser(socket);
        });
    }
}
