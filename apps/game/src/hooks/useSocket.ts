import { useEffect, useState } from "react";
import { GAME_OVER, MATCH_MAKING } from "../types/messagetypes";
import { useSearchParams } from "react-router-dom";

interface User {
  id: string;
  username: string;
  profilePicture: string;
  gameId: string | null;
}

const useSocket = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Parse query params and initialize user
  useEffect(() => {
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const profilePicture = decodeURIComponent(searchParams.get("profilePicture") || "");
    const gameId = searchParams.get("gameId");

    if (!id || !username || !profilePicture) {
      console.error("Missing parameters in route.");
      return;
    }

    setUser({ id, username, profilePicture , gameId});
  }, [searchParams]);

  // WebSocket connection
  useEffect(() => {
    if (!user) return; // Wait until the user is set

    const ws = new WebSocket("ws://localhost:8080");
    const payload = user.gameId ? { user, gameId: user.gameId } : { user };
    ws.onopen = () => {
      console.log("Connected to the sockets");
      setSocket(ws);

      // Send matchmaking request
      ws.send(
        JSON.stringify({
          type: MATCH_MAKING,
          payload
        })
      );
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      // You can add specific handling of WebSocket messages here
    };

    ws.onclose = () => {
      console.log("Disconnected from the sockets");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      console.log("Cleaning up WebSocket connection");
      ws.close();
    };
  }, [user]);

  return [socket, user] as const;
};

export default useSocket;
