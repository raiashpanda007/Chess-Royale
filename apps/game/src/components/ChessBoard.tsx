import { Square, PieceSymbol, Color, Chess } from "chess.js";
import { useState, useEffect } from "react";
import { MOVE, START } from "../types/messagetypes";

function ChessBoard({
  board,
  socket,
  setBoard,
  chess,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    >
  >;
  chess: Chess;
}) {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data);

      if (data.type === START) {
        setPlayerColor(data.color); // Set the player's color (black/white) when received
      }
    };

    socket.addEventListener("message", handleSocketMessage);

    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket]);

  if (!socket) return <div className="text-white">Loading WebSocket...</div>;

  if (playerColor === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold text-white">Waiting for color assignment...</div>
      </div>
    );
  }

  const renderedBoard = playerColor === "b" ? [...board].reverse() : board;

  return (
    <div className="chess-board">
      {renderedBoard.map((row, i) => {
        const renderedRow = playerColor === "b" ? [...row].reverse() : row;

        return (
          <div key={i} className="w-full flex rounded-lg">
            {renderedRow.map((square, j) => {
              const squareRepresentation =
                playerColor === "b"
                  ? (String.fromCharCode(97 + (7 - j)) + (i + 1)) as Square
                  : (String.fromCharCode(97 + j) + (8 - i)) as Square;

              return (
                <div
                  key={j}
                  className={`w-24 h-24 flex justify-center items-center ${
                    (i + j) % 2 ? `bg-green-800` : `bg-white`
                  }`}
                  onClick={async () => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } else {
                      const isPawn =
                        chess.get(from)?.type === "p" &&
                        (playerColor === "w"
                          ? squareRepresentation[1] === "8"
                          : squareRepresentation[1] === "1");

                      let promotion ;

                      if (isPawn) {
                        promotion = await new Promise<PieceSymbol>((resolve) => {
                          const piece = prompt(
                            "Promote pawn to (q/r/b/n):",
                            "q"
                          )?.toLowerCase() as PieceSymbol;
                          resolve(piece);
                        });
                      }

                      setTo(squareRepresentation);

                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          move: {
                            from,
                            to: squareRepresentation,
                            promotion, // Include promotion if applicable
                          },
                        })
                      );

                      setFrom(null);

                      chess.move({
                        from,
                        to: squareRepresentation,
                        promotion, // Pass promotion to chess.js
                      });

                      setBoard(chess.board());
                    }
                  }}
                >
                  {square ? (
                    <img
                      src={`${square?.color === "b" ? square.type : `${square?.type?.toUpperCase()}`}.png`}
                      alt={`${square.color} ${square.type}`}
                      className="piece"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default ChessBoard;
