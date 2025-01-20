import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_INITIALIZE, GAME_OVER, INVALID_MOVE, MOVE } from "./message";
import { PrismaClient } from "@workspace/db";
import type { User,Move } from "@workspace/types";
const prisma = new PrismaClient();
export class Game {
    public id: string
    public player1: { socket: WebSocket, user: User }
    public player2: { socket: WebSocket, user: User }
    private board: Chess
    private movesCount: number;

    constructor(player1: { socket: WebSocket, user: User }, player2: { socket: WebSocket, user: User }, id: string) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.movesCount = 0;

        this.player1.socket.send(JSON.stringify({
            type: GAME_INITIALIZE,
            color: "white"
        }))
        this.player2.socket.send(JSON.stringify({
            type: GAME_INITIALIZE,
            color: 'black'
        }))
    }
    checkPromotion(move:Move) {
        const promotionRank = this.board.turn() === "w" ? 8 : 1; // 8th for white, 1st for black
        const fromSquare = move.from[1];
        const toSquare = move.to[1];
        if(fromSquare ===null || toSquare === null){
            return false;
        }
        

        return fromSquare === (promotionRank - 1).toString() && toSquare === (promotionRank).toString();
    }
    async gameComplete(winner: string) {
        await prisma.$transaction(async (tx) => {
            if (winner === 'draw') {
                await tx.match.update({
                    where: {
                        id: this.id
                    },
                    data: {
                        result: 'DRAW'
                    }
                })
            } else {
                winner === 'white' ? await tx.match.update({
                    where: {
                        id: this.id
                    },
                    data: {
                        result: 'WINNER1'
                    }
                }) : await tx.match.update({
                    where: {
                        id: this.id
                    },
                    data: {
                        result: 'WINNER2'
                    }
                })
            }

        })
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
                checkmate: this.board.isCheckmate(),
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
                payload: move
            }))
        } else {
            this.player1.socket.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        this.movesCount++;

    }
}