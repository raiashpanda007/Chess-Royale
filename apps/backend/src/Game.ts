import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { CHECKMATE, GAME_INITIALIZE, GAME_OVER, INVALID_MOVE, MOVE, START } from "./message";
import { Prisma, PrismaClient } from "@workspace/db";
import type { User, Move } from "@workspace/types";
const prisma = new PrismaClient();
export class Game {
    public id: string
    public player1: { socket: WebSocket, user: User }
    public player2: { socket: WebSocket, user: User }
    private board: Chess
    private movesCount: number;
    private isTournamentGame: boolean;
    constructor(player1: { socket: WebSocket, user: User }, player2: { socket: WebSocket, user: User }, id: string, tournamentGame: boolean) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.movesCount = 0;

        this.player1.socket.send(JSON.stringify({
            type: START,
            color: "w"
        }))
        this.player2.socket.send(JSON.stringify({
            type: START,
            color: 'b'
        }))
        this.isTournamentGame = tournamentGame;
    }
    checkPromotion(move: Move) {
        const promotionRank = this.board.turn() === "w" ? 8 : 1; // 8th for white, 1st for black
        const fromSquare = move.from[1];
        const toSquare = move.to[1];
        if (fromSquare === null || toSquare === null) {
            return false;
        }


        return fromSquare === (promotionRank - 1).toString() && toSquare === (promotionRank).toString();
    }
    async gameComplete(winner: string) {
        const tournament = await prisma.tournament.findFirst({
            where: {
                rounds: {
                    some: {
                        matches: {
                            some: { id: this.id }
                        }
                    }
                }
            },
            select: { id: true }
        });
    
        await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            // Update match result
            await tx.match.update({
                where: { id: this.id },
                data: { result: winner === "draw" ? "DRAW" : winner === "white" ? "WINNER1" : "WINNER2" }
            });
    
            // If it's a tournament game, update the scorecards
            if (tournament?.id) {
                if (winner === "draw") {
                    await tx.scoreCard.updateMany({
                        where: {
                            tournamentId: tournament.id,
                            playerId: { in: [this.player1.user.id, this.player2.user.id] }
                        },
                        data: { score: { increment: 0.5 } }
                    });
                } else {
                    await tx.scoreCard.update({
                        where: {
                            tournamentId_playerId: {
                                playerId: winner === "white" ? this.player1.user.id : this.player2.user.id,
                                tournamentId: tournament.id
                            }
                        },
                        data: { score: { increment: 1 } }
                    });
                }
            }
        });
    }

    async makeMove(socket: WebSocket, move: Move) {
        // Logic to check whether the player is moving the piece when is it his turn 
        if (this.movesCount % 2 === 0 && socket != this.player1.socket) {
            return;
        }
        if (this.movesCount % 2 === 1 && socket != this.player2.socket) {
            return;
        }

        try {

            if (this.checkPromotion(move)) {
                if (!move.promotion) {
                    // Ask the frontend for the promotion piece selection
                    socket.send(JSON.stringify({
                        type: 'PROMOTION',
                        message: 'Please select your promotion piece (Knight, Queen, Rook, or Bishop).'
                    }));
                    return;
                }
                // Apply the promotion with the selected piece (e.g., Queen, Knight, etc.)
                this.board.move({
                    from: move.from,
                    to: move.to,
                    promotion: move.promotion
                });
            } else {
                // Regular move
                this.board.move(move);
            }
            console.log("Move is made");
        } catch (error) {
            socket.send(JSON.stringify({
                type: INVALID_MOVE,
                payload: { error: "Invalid move" }
            }));
            return;
        }

        if (this.board.isGameOver()) {
            const winner = this.board.isCheckmate()
                ? this.board.turn() === "w" ? "black" : "white"
                : "draw";

            // Persist the result to the databas()e
            await this.gameComplete(winner);

            const payload = winner ? {
                winner,
                user: winner === "white" ? this.player1.user : this.player2.user,
                method: CHECKMATE,
            } : { draw: true };

            const gameOverPayload = {
                type: GAME_OVER,
                payload
            };

            // Notify both players
            this.player1.socket.send(JSON.stringify(gameOverPayload));
            this.player2.socket.send(JSON.stringify(gameOverPayload));

            return;
        }
        if (this.movesCount % 2 === 0) {
            this.player2.socket.send(JSON.stringify({
                type: MOVE,
                payload: move,
                moveBy: 'w'
            }))
        } else {
            this.player1.socket.send(JSON.stringify({
                type: MOVE,
                payload: move,
                moveBy: 'b'
            }))
        }
        this.movesCount++;

    }
}