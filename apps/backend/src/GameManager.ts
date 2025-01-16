import {WebSocket} from "ws";
import { GAME_INITIALIZE, MOVE } from "./message";
import { Game } from "./Game";

export default class GameHandler {
    private games: Game[] ;
    private pendingUser: WebSocket | null;
    private users: WebSocket[] 


    constructor (){
        this.games = []
        this.pendingUser = null;
        this.users = []
    }
    addUser (socket: WebSocket) {
        console.log('New User');
        this.users.push(socket)
        this.addHandler(socket);
    }
    removeUser (socket: WebSocket) {
        this.users = this.users.filter(u => u !== socket);
    
    }
    private addHandler (socket:WebSocket){
        socket.on('message',(data)=>{
            console.log('Received:',data.toString());
            const message = JSON.parse(data.toString());
            if (message.type === GAME_INITIALIZE){
                if(this.pendingUser){
                    const game  = new Game(this.pendingUser,socket);
                    this.games.push(game);
                }else {
                    this.pendingUser = socket;
                }
                

            } 
            if(message.type === MOVE) {
                const game = this.games.find((game)=> game.player1 === socket || game.player2 )
                if(game) {
                     game.makeMove(socket,message.move)
                }
            }
        })
    }

}