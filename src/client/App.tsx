import { useContext, useState } from "react";
import { GameBoardState, GameSymbol } from "./types";
import { GameContext } from "./GameContext";

export default function App() {
  const [turn, setTurn] = useState(0);
  const [gameState, setGameState] = useState<GameBoardState>(
    [...Array(3)].map(() => [...Array(3)])
  );

  return (
    <GameContext.Provider
      value={{
        onGameMove(x, y) {
          if (gameState[y][x] === undefined) {
            gameState[y][x] = turn % 2 === 0 ? "X" : "O";
            setGameState(gameState);
            setTurn((c) => c + 1);
          }
        },
      }}
    >
      <div>
        <h1 className="text-center font-serif font-bold text-4xl mb-4">
          {turn % 2 === 0 ? "X" : "O"}'s turn
        </h1>
        <GameBoard state={gameState} />
      </div>
    </GameContext.Provider>
  );
}

function GameBoard({ state }: { state: GameBoardState }) {
  const { onGameMove } = useContext(GameContext);

  return (
    <table>
      <tbody>
        {state.map((row, y) => (
          <tr key={y}>
            {row.map((cell, x) => (
              <td key={`${y}-${x}`} className="w-24 h-24 border-2">
                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer select-none hover:bg-slate-50"
                  onClick={() => onGameMove(x, y)}
                >
                  <GameBoard.Cell symbol={cell} x={x} y={y} />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

GameBoard.Cell = function ({
  symbol,
  x,
  y,
}: {
  symbol: GameSymbol | undefined;
  x: number;
  y: number;
}) {
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
