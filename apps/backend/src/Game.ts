import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_INITIALIZE, GAME_OVER, MOVE } from "./message";
export class Game {
    public player1: WebSocket
    public player2: WebSocket
    private board: Chess
    private movesCount :number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.movesCount = 0;

        this.player1.send(JSON.stringify({
            type:GAME_INITIALIZE,
            color:"white"
        }))
        this.player2.send(JSON.stringify({
            type:GAME_INITIALIZE,
            color:'black'
        }))
    }



    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        // Logic to check whether the player is moving the piece when is it his turn 
        if (this.movesCount % 2 === 0 && socket != this.player1) {
            return;
        }
        if (this.movesCount % 2 === 1 && socket != this.player2) {
            return;
        }

        try {
            this.board.move(move);
            console.log("move is made")
        } catch (error) {
            return
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? 'black' : 'white'
                }
            }))
            //Sending the winner of the match to the client 
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? 'black' : 'white'
                }
            }))
            return; // The game is completed 
        } 
        if(this.movesCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
        this.movesCount++;

    }
}