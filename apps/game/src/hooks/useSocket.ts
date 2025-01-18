import { useEffect, useState } from "react";
import { GAME_INITIALIZE, GAME_OVER } from "../types/messagetypes";

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log("Connected to the sockets");
      setSocket(ws);
      ws.send(JSON.stringify({
        type: GAME_INITIALIZE
      }))
    }
    ws.onclose = () => {
      console.log("disconnected to the sockets");
      setSocket(null);
      ws.send(JSON.stringify({
        type: GAME_OVER
      }))
    }
    return () => {
      ws.close();
    }
  }, [])
  return socket;
};
export default useSocket
