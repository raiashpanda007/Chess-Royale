import { Square, PieceSymbol, Color, Chess } from "chess.js";
import { useState, useEffect } from "react";
import { MOVE, START } from "../types/messagetypes";
import WhiteClock from "./WhiteClock";
import BlackClock from "./BlackClock";

function ChessBoard({
  board,
  socket,
  setBoard,
  chess,
  time,
  addedTime,
  gameOver,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket | null;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    >
  >;
  chess: Chess;
  time: number;
  addedTime: number | null;
  gameOver: boolean;
}) {
  const [from, setFrom] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      if (data.type === START) {
        setPlayerColor(data.color);
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
        <div className="text-xl font-bold text-white">
          Waiting for color assignment...
        </div>
      </div>
    );
  }

  const renderedBoard = playerColor === "b" ? [...board].reverse() : board;

  return (
    <div className="chess-board">
      {!gameOver && playerColor === "b" ? (
        <WhiteClock chess={chess} initialTime={time} addedTime={addedTime} />
      ) : (
        <BlackClock chess={chess} initialTime={time} addedTime={addedTime} />
      )}
      {!gameOver &&
        renderedBoard.map((row, i) => {
          const renderedRow = playerColor === "b" ? [...row].reverse() : row;

          return (
            <div key={i} className="w-full flex rounded-lg">
              {renderedRow.map((square, j) => {
                const squareRepresentation =
                  playerColor === "b"
                    ? ((String.fromCharCode(97 + (7 - j)) + (i + 1)) as Square)
                    : ((String.fromCharCode(97 + j) + (8 - i)) as Square);

                const isHighlighted = validMoves.includes(squareRepresentation);

                return (
                  <div
                    key={j}
                    className={`w-20 sm:w-24  sm:h-24 h-20 flex justify-center items-center ${
                      isHighlighted
                        ? "bg-yellow-200 border"
                        : (i + j) % 2
                          ? "bg-green-800"
                          : "bg-white" 
                    }`}
                    onClick={async () => {
                      if (!from) {
                        if (square && square.color === playerColor) {
                          setFrom(squareRepresentation);
                          const possibleMoves = chess
                            .moves({
                              square: squareRepresentation,
                              verbose: true,
                            })
                            .map((m) => m.to);
                          setValidMoves(possibleMoves as Square[]);
                        }
                      } else {
                        const isPawn =
                          chess.get(from)?.type === "p" &&
                          (playerColor === "w"
                            ? squareRepresentation[1] === "8"
                            : squareRepresentation[1] === "1");

                        let promotion;

                        if (isPawn) {
                          promotion = await new Promise<PieceSymbol>(
                            (resolve) => {
                              const piece = prompt(
                                "Promote pawn to (q/r/b/n):",
                                "q"
                              )?.toLowerCase() as PieceSymbol;
                              resolve(piece);
                            }
                          );
                        }

                        setValidMoves([]); // Clear highlights
                        setFrom(null);

                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            move: { from, to: squareRepresentation, promotion },
                          })
                        );

                        chess.move({
                          from,
                          to: squareRepresentation,
                          promotion,
                        });
                        setBoard(chess.board());
                      }
                    }}
                  >
                    {square ? (
                      <img
                        src={`/${square?.color === "b" ? square.type : `${square?.type?.toUpperCase()}`}.png`}
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
      {!gameOver && playerColor === "b" ? (
        <BlackClock chess={chess} initialTime={time} addedTime={addedTime} />
      ) : (
        <WhiteClock chess={chess} initialTime={time} addedTime={addedTime} />
      )}
    </div>
  );
}

export default ChessBoard;
