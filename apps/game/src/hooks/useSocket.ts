import { useEffect, useState } from "react";

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = ()=>{
            console.log("Connected to the sockets");
            setSocket(ws);
        }
        ws.onclose = () =>{
            console.log("disconnected to the sockets");
            setSocket(null);
        }
        return ()=>{
            ws.close();
        }
    },[])
  return socket;
};
export default useSocket
