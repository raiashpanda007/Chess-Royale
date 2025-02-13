import { useEffect, useState } from "react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import ChessBoard from "./components/ChessBoard";
import { Button } from "@workspace/ui/components/button";
import useSocket from "./hooks/useSocket";
import { Chess } from "chess.js";
import Promotion from "./components/Promotion";
import {
  DRAW,
  MATCH_MAKING,
  PROMOTION,
  RESIGN,
  SENDING_DRAW,
} from "./types/messagetypes";
import WinnerCard from "./components/Winner";
import DrawRequest from "./components/DrawRequest";

// You might already have this interface defined elsewhere.
interface User {
  username: string;
  profilePicture: string;
  id: string;
}

const resignGame = async (socket: WebSocket | null) => {
  if (!socket) return <div>Socket is connected</div>;
  socket.send(
    JSON.stringify({
      type: RESIGN,
    })
  );
};

const sendDrawRequest = async (socket: WebSocket | null) => {
  if (!socket) return <div>Socket is connected</div>;
  socket.send(
    JSON.stringify({
      type: DRAW,
      payload: SENDING_DRAW,
    })
  );
};

function App() {
  const GAME_INITIALIZE = "game_init";
  const MOVE = "move";
  const GAME_OVER = "game_over";

  const [chess, setChess] = useState(() => new Chess());
  const [board, setBoard] = useState(chess.board());
  const [socketReady, setSocketReady] = useState(false);
  const [time, setTime] = useState<number>(10);
  const [addedTime, setAddedTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [socket, user] = useSocket();
  const [winnerDetails, setWinnerDetails] = useState<{
    user: User | null;
    method: string | null;
    draw: boolean | null;
  } | null>(null);
  const [drawRequest, setDrawRequest] = useState<boolean>(false);

  // IMPORTANT: Remove "chess" from the dependency array so this effect runs only once per socket change.
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
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          break;
        case GAME_OVER:
          console.log("Game over");
          setGameOver(true);
          setWinnerDetails({
            user: message.payload.user,
            method: message.payload.method,
            draw: message.payload.draw,
          });
          break;
        case PROMOTION:
          // Handle promotion appropriately here.
          // For example, you might want to show a promotion modal.
          <Promotion socket={socket} />;
          break;
        case DRAW:
          if (message.payload === SENDING_DRAW) {
            setDrawRequest(true);
          }
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
    <div className="h-screen bg-black text-white relative font-semibold flex flex-col md:flex-row relative">
      {gameOver && winnerDetails && (
        <div className="w-full h-full flex justify-center items-center">
          <WinnerCard
            user={winnerDetails.user}
            method={winnerDetails.method}
            draw={winnerDetails.draw}
          />
        </div>
      )}

      <div
        className={
          drawRequest
            ? "absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
            : "hidden"
        }
      >
        <DrawRequest socket={socket} setDrawRequest={setDrawRequest} />
      </div>

      {!gameOver && (
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="mx-auto w-full max-w-md md:max-w-sm lg:max-w-xs">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
              time={time}
              addedTime={addedTime}
              gameOver={gameOver}
            />
          </div>
          <div className="w-full md:w-1/3 border flex flex-col">
            <div className="flex justify-around items-center p-4">
              <Button
                variant={"destructive"}
                onClick={() => resignGame(socket)}
              >
                Resign
              </Button>
              <Button onClick={() => sendDrawRequest(socket)}>Draw</Button>
            </div>
            <ScrollArea className="flex-1 w-full overflow-auto p-4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
