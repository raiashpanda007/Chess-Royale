import { WebSocketServer } from "ws";
import GameHandler from "./GameManager";
import { PrismaClient } from "@workspace/db"
import type { User } from '@workspace/types'

import {  MATCH_MAKING } from "./message";
const prisma = new PrismaClient();
const gameHandler = new GameHandler();
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
    console.log('New Connection', ws);
    wss.on('message', (data) => {
        const message = JSON.parse(data.toString());
        if(message.type===MATCH_MAKING) {
            const user = message.payload.user as User;
            gameHandler.addUser(ws,user)
        }
    })


    ws.on('disconnect', () => gameHandler.removeUser(ws))
})