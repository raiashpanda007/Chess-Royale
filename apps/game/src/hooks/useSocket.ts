import { useEffect, useState } from "react";
import { GAME_OVER, MATCH_MAKING } from "../types/messagetypes";
import { useSearchParams } from "react-router-dom";

const useSocket = () => {
  const [searchParams] = useSearchParams();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const id = searchParams.get("id");
  const username = searchParams.get("username");
  const email = searchParams.get("email");
  const profilePicture = decodeURIComponent(searchParams.get("profilePicture") || "");
  useEffect(() => {
    if (!id || !username || !profilePicture) {
      console.error("Missing parameters in route.");
      return;
    }

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to the sockets");
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: MATCH_MAKING,
          payload: {
            user: {
              id,
              username,
              profilePicture,
            },
          },
        })
      );
    };

    ws.onclose = () => {
      console.log("Disconnected from the sockets");
      setSocket(null);

      ws.send(
        JSON.stringify({
          type: GAME_OVER,
        })
      );
    };

    return () => {
      ws.close();
    };
  }, [id, username, profilePicture]);

  return socket;
};

export default useSocket;
