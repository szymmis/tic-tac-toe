import { useState } from "react";
import { useGameStateStore } from "stores/useGameStateStore";

import GameBoard from "@/components/GameBoard";
import Heading from "@/components/Heading";
import useGameServer from "@/hooks/useGameServer";
import { GameBoardState } from "@/shared/types";

export default function GamePage() {
  const { symbol, opponent, turn, setGameInfo } = useGameStateStore();
  const [gameState, setGameState] = useState<GameBoardState>(
    [...Array(3)].map(() => [...Array(3)]),
  );

  const { move } = useGameServer({
    onMove(x, y, symbol2, turn) {
      if (symbol && opponent) {
        setGameInfo({ turn });
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
      <Heading
        className="text-center"
        title={
          turn !== undefined && turn % 2 === (symbol === "X" ? 0 : 1)
            ? "Your turn"
            : `${opponent}'s turn`
        }
      />

      <GameBoard
        state={gameState}
        onMove={(x, y) => {
          if (!gameState[y][x]) move(x, y);
        }}
      />
    </div>
  );
}
