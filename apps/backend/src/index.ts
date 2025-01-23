import { WebSocketServer } from "ws";
import GameHandler from "./GameManager";
import type { User } from "@workspace/types";

import { MATCH_MAKING } from "./message";

const gameHandler = new GameHandler();
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
    console.log("New connection established");

    ws.on("message", (data) => {
        try {
            console.log("Message received:", data.toString());
            const message = JSON.parse(data.toString());
            if (message.type === MATCH_MAKING) {
                const user = message.payload.user as User;
                console.log("User joined:", user);

                gameHandler.addUser(ws, user);
                ws.send(JSON.stringify({ type: "match_making", payload: "success" }));
            }
        } catch (error) {
            console.error("Invalid message received:", data.toString(), error);
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });

    ws.on("close", () => {
        console.log("Connection closed");
        gameHandler.removeUser(ws);
    });
});
