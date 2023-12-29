import { useState } from "react";

import { GameBoardState } from "../../types";
import GameBoard from "../components/GameBoard";
import { useGameContext } from "../contexts/GameContext";
import useGameServer from "../hooks/useGameServer";

export default function GamePage() {
  const { symbol, opponent, turn, setGameInfo } = useGameContext();
  const [gameState, setGameState] = useState<GameBoardState>(
    [...Array(3)].map(() => [...Array(3)]),
  );

  const { move } = useGameServer({
    onMove(x, y, symbol2, turn) {
      if (symbol && opponent) {
        setGameInfo(symbol, opponent, turn);
        setGameState((currState) => {
          const state = structuredClone(currState);
          state[y][x] = symbol2;
          return state;
        });
      }
    },
  });

  console.log({ turn }, symbol === "X" ? 0 : 1);

  return (
    <div>
      <h1 className="mb-4 font-serif text-4xl font-bold text-center">
        {turn !== undefined && turn % 2 === (symbol === "X" ? 0 : 1)
          ? "Your turn"
          : `${opponent}'s turn`}
      </h1>
      <GameBoard
        state={gameState}
        onMove={(x, y) => {
          if (!gameState[y][x]) move(x, y);
        }}
      />
    </div>
  );
}
