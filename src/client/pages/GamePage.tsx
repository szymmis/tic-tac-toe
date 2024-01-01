import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useGameStateStore } from "stores/useGameStateStore";

import Button from "@/components/Button";
import GameBoard from "@/components/GameBoard";
import Heading from "@/components/Heading";
import useMe from "@/hooks/api/queries/useMe";
import useGameServer from "@/hooks/useGameServer";
import useIsYourTurn from "@/hooks/useIsYourTurn";
import { GameBoardState } from "@/shared/types";

export default function GamePage() {
  const { symbol, opponent, setGameInfo } = useGameStateStore();
  const [outcome, setOutcome] = useState<string>();
  const [gameState, setGameState] = useState<GameBoardState>(
    [...Array(3)].map(() => [...Array(3)]),
  );
  const isYourTurn = useIsYourTurn();
  const { refetch } = useMe();

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
      refetch();
      setOutcome(outcome);
    },
  });

  return (
    <div>
      <Heading
        className="text-center"
        title={isYourTurn ? "Your turn" : `${opponent}'s turn`}
      />

      <p className="relative flex justify-between">
        <span>
          <b className="text-xs">{symbol}</b> You
        </span>{" "}
        <span className="absolute self-center w-full text-xs font-bold text-center text-gray-400">
          vs
        </span>
        <span>
          {opponent} <b className="text-xs">{symbol === "X" ? "O" : "X"}</b>
        </span>
      </p>

      <GameBoard
        state={gameState}
        onMove={(x, y) => {
          if (!gameState[y][x]) move(x, y);
        }}
      />

      {outcome && <OutcomeOverlay outcome={outcome} />}
    </div>
  );
}

function OutcomeOverlay({ outcome }: { outcome: string }) {
  const navigate = useNavigate();

  const label = useMemo(() => {
    switch (outcome) {
      case "win":
        return "You have won!";
      case "loss":
        return "You've been defeated!";
      case "draw":
        return "It's a draw!";
      case "forfeit":
        return "Your opponent has forfeited!";
      default:
        throw new Error(`Unknown outcome: ${outcome}`);
    }
  }, [outcome]);

  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full gap-2 backdrop-blur-sm">
      <Heading title={label} className="text-center" />
      <Button label="Continue" onClick={() => navigate("/")} />
    </div>
  );
}
