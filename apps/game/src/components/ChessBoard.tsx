import { Square, PieceSymbol, Color } from "chess.js";
function ChessBoard({
  board,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) {
  return (
    <div className="">
      {board.map((row, i) => {
        return (
          <div key={i} className="w-full flex rounded-lg ">
            {row.map((square, j) => {
              return (
                <div
                  key={j}
                  className={`w-24 h-24  ${(i + j) % 2 ? `bg-green-500` : `bg-white`} ${!i && !j ? "rounded-ss-md" : !i && j === 7 ? "rounded-se-md" : !j&&i === 7 ? 'rounded-es-md' : i === 7 && j === 7 ? 'rounded-ee-md':' '}`}
                >
                  {square ? square.type : ""}
                  
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
