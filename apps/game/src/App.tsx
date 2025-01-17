import { useEffect, useState } from "react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import ChessBoard from "./components/ChessBoard";
import { Button } from "@workspace/ui/components/button";
import useSocket from "./hooks/useSocket";
import { Chess } from "chess.js";

function App() {
  const GAME_INITIALIZE = "game_init";
  const MOVE = "move";
  const GAME_OVER = "game_over";

  const [chess, setChess] = useState(() => new Chess()); // Initialize once
  const [board, setBoard] = useState(chess.board());
  const [socketReady, setSocketReady] = useState(false); // Track socket readiness
  const socket = useSocket();

  const moves = [
    ["e4", "e5"],
    ["Nf3", "Nc6"],
  ];

  // Ensure hooks aren't conditionally rendered
  useEffect(() => {
    if (!socket) return;

    // Mark the socket as ready
    setSocketReady(true);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received on board", message);

      switch (message.type) {
        case GAME_INITIALIZE:
          const newGame = new Chess();
          setChess(newGame); // Update the chess instance
          setBoard(newGame.board()); // Sync the board
          break;

        case MOVE:
          const updatedGame = new Chess(chess.fen()); // Clone the current game state
          updatedGame.move(message.move); // Apply the move
          setChess(updatedGame); // Update state
          setBoard(updatedGame.board()); // Sync the board
          break;

        case GAME_OVER:
          console.log("Game over");
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
    <div className="h-screen bg-black flex font-white font-poppins font-semibold ">
      <div className="w-2/3 border h-full flex justify-center items-center">
        <ChessBoard board={board} />
      </div>
      <div className="w-1/3 border h-full ">
        <div className="h-1/6">
          <Button variant={"destructive"}>Resign</Button>
        </div>
        <ScrollArea className="h-5/6 w-full overflow-auto">
          {moves.map((move, index) => (
            <div
              key={index}
              className={
                index % 2 === 0
                  ? "w-full text-white"
                  : "w-full bg-gray-900 text-white"
              }
            >
              <div className="p-2 flex justify-between">
                <span>{index + 1}.</span> <span>{move[0]}</span>{" "}
                <span>{move[1]}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

export default App;
