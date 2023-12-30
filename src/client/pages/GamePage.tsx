import { useState } from "react";
import { useNavigate } from "react-router";
import { useGameStateStore } from "stores/useGameStateStore";

import GameBoard from "@/components/GameBoard";
import Heading from "@/components/Heading";
import useGameServer from "@/hooks/useGameServer";
import useIsYourTurn from "@/hooks/useIsYourTurn";
import { GameBoardState } from "@/shared/types";

export default function GamePage() {
  const navigate = useNavigate();
  const { opponent, setGameInfo } = useGameStateStore();
  const [gameState, setGameState] = useState<GameBoardState>(
    [...Array(3)].map(() => [...Array(3)]),
  );
  const isYourTurn = useIsYourTurn();

  const { move } = useGameServer({
    onMove(x, y, symbol, turn) {
      setGameInfo({ turn });
      setGameState((currState) => {
        const state = structuredClone(currState);
        state[y][x] = symbol;
        return state;
      });
    },
    onGameEnd(outcome) {
      console.log(outcome);
      navigate("/");
    },
  });

  return (
    <div>
      <Heading
        className="text-center"
        title={isYourTurn ? "Your turn" : `${opponent}'s turn`}
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
