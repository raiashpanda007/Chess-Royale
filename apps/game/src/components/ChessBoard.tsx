import { Square, PieceSymbol, Color, Chess } from "chess.js";
import { useState } from "react";
import { MOVE } from "../types/messagetypes";

function ChessBoard({
  board,
  socket,
  setBoard,
  chess
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
  chess:Chess
}) {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  if (!socket) return <div>Loading...</div>;

  return (
    <div className="">
      {board.map((row, i) => {
        return (
          <div key={i} className="w-full flex rounded-lg">
            {row.map((square, j) => {
              // Correctly calculate square representation (e.g., A2, D4)
              const squareRepresentation = (String.fromCharCode(97 + j) +
                (8 - i)) as Square;

              return (
                <div
                  key={j}
                  className={`w-24 h-24 flex justify-center items-center ${
                    (i + j) % 2 ? `bg-green-800` : `bg-white`
                  } ${
                    !i && !j
                      ? "rounded-ss-md"
                      : !i && j === 7
                        ? "rounded-se-md"
                        : !j && i === 7
                          ? "rounded-es-md"
                          : i === 7 && j === 7
                            ? "rounded-ee-md"
                            : ""
                  }`}
                  onClick={() => {
                    if (!from) setFrom(squareRepresentation);
                    else {
                      setTo(squareRepresentation);
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          move: {
                            from,
                            to: squareRepresentation,
                          },
                        })
                      );

                      setFrom(null); // Reset from after sending the move
                      chess.move({
                        from,
                        to: squareRepresentation,
                      }); // Update state
                      setBoard(chess.board());
                    }
                  }}
                >
                  {square ? <img src={`${square?.color === 'b'?square.type:`${square?.type?.toUpperCase()}`}.png`} />:null}
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
