import { GameBoardState, GameSymbol } from "../../types";
import useGameServer from "../hooks/useGameServer";

export default function GameBoard({
  state,
  onMove,
}: {
  state: GameBoardState;
  onMove: (x: number, y: number) => void;
}) {
  return (
    <table>
      <tbody>
        {state.map((row, y) => (
          <tr key={y}>
            {row.map((cell, x) => (
              <td key={`${y}-${x}`} className="w-24 h-24 border-2">
                <div
                  className="flex items-center justify-center w-full h-full cursor-pointer select-none hover:bg-slate-50"
                  onClick={() => {
                    onMove(x, y);
                  }}
                >
                  <GameBoard.Cell symbol={cell} />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

GameBoard.Cell = function ({ symbol }: { symbol: GameSymbol | undefined }) {
  switch (symbol) {
    case "X":
      return (
        <svg width={48} height={48}>
          <path stroke="black" strokeWidth={3} d="M 0,0 L 48,48" />
          <path stroke="black" strokeWidth={3} d="M 48,0 L 0,48" />
        </svg>
      );
    case "O":
      const strokeWidth = 3;
      const size = 48 + strokeWidth * 2;

      return (
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={24}
            fill="none"
            stroke="black"
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    default:
      return;
  }
};
