import { WebSocketServer } from "ws";
import GameHandler from "./GameManager";
const wss = new WebSocketServer({port:8080});
const gameHandler = new GameHandler();
wss.on('connection',function connection(ws){
    console.log('New Connection',ws);
    gameHandler.addUser(ws);

    ws.on('disconnect',()=> gameHandler.removeUser(ws))  
})