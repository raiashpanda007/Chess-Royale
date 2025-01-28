import { useEffect, useState } from "react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import ChessBoard from "./components/ChessBoard";
import { Button } from "@workspace/ui/components/button";
import useSocket from "./hooks/useSocket";
import { Chess } from "chess.js";
import { MATCH_MAKING, PROMOTION, START } from "./types/messagetypes";
import { Toaster } from "@workspace/ui/components/sonner";
import { useNavigation } from "react-router-dom";
import Promotion from "./components/Promotion";

function App() {
  const navigate = useNavigation();
  const GAME_INITIALIZE = "game_init";
  const MOVE = "move";
  const GAME_OVER = "game_over";


  const [chess, setChess] = useState(() => new Chess()); // Initialize once
  const [board, setBoard] = useState(chess.board());
  const [socketReady, setSocketReady] = useState(false); // Track socket readiness
  const [time,setTime] = useState<number> (10);
  const [addedTime, setAddedTime] = useState<number | null>(null);
  const [socket, user] = useSocket();

  // Ensure hooks aren't conditionally rendered
  useEffect(() => {
    if (!socket) return;

    // Mark the socket as ready
    setSocketReady(true);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received on board", message);

      switch (message.type) {
        case MATCH_MAKING:
          if (message.payload === "success") {
            console.log("Match making success");
          }
          socket.send(
            JSON.stringify({
              type: GAME_INITIALIZE,
              payload: {
                user,
              },
            })
          );
          break;
        case GAME_INITIALIZE:
          const newGame = new Chess();
          setChess(newGame); // Update the chess instance
          setBoard(newGame.board()); // Sync the board
          setTime(message.payload.game.time);
          setAddedTime(message.payload.game.AddedTime);
          break;
        

        case MOVE:
          const move = message.payload; // Apply the move
          chess.move(move); // Update state
          setBoard(chess.board()); // Sync the board
          
          break;

        case GAME_OVER:
          console.log("Game over");
          const result = message.payload;
          break;
        case PROMOTION:
          <Promotion socket={socket} />;
          break;

        default:
          console.error("Unknown message type:", message.type);
      }
    };
  }, [socket, chess]);

  if (!socketReady) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex font-white relative  font-semibold ">
      <div className="w-2/3 border h-full flex justify-center items-center">
        <ChessBoard
          chess={chess}
          setBoard={setBoard}
          board={board}
          socket={socket}
          time={time}
          addedTime={addedTime}
        />
      </div>
      <div className="w-1/3 border h-full ">
        <div className="h-1/6">
          <Button variant={"destructive"}>Resign</Button>
        </div>
        <ScrollArea className="h-5/6 w-full overflow-auto"></ScrollArea>
      </div>
    </div>
  );
}

export default App;