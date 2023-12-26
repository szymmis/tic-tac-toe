import { useContext, useEffect, useRef, useState } from "react";
import { GameBoardState, GameSymbol } from "../types";
import { GameContext } from "./GameContext";

function useWebSocket(onMessage: (msg: Record<string, any>) => void) {
  const socket = useRef<WebSocket>();

  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket(`ws://${location.hostname}:8080`);

      socket.current.addEventListener("open", () => {
        socket.current?.send(
          JSON.stringify({
            action: "auth",
            payload: { key: "749824798349832497439728439824" },
          })
        );
      });

      socket.current.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {}
      });
    }
  }, []);

  return {
    send: (action: string, payload: object) =>
      socket.current?.send(
        JSON.stringify({
          action,
          payload,
        })
      ),
  };
}

export default function App() {
  const [turn, setTurn] = useState(0);
  const [gameState, setGameState] = useState<GameBoardState>(
    [...Array(3)].map(() => [...Array(3)])
  );

  const ws = useWebSocket((msg) => {
    if (msg.action === "move") {
      const { x, y, symbol } = msg.payload;
      gameState[y][x] = symbol;
      setGameState(gameState);
      setTurn((c) => c + 1);
    }
  });

  return (
    <GameContext.Provider
      value={{
        onGameMove(x, y) {
          if (gameState[y][x] === undefined) {
            // gameState[y][x] = turn % 2 === 0 ? "X" : "O";
            // setGameState(gameState);

            ws.send("move", { x, y });
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
