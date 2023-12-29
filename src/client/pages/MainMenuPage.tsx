import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/Button";
import { useGameContext } from "@/contexts/GameContext";
import useGameServer from "@/hooks/useGameServer";

export default function MainMenuPage() {
  const navigate = useNavigate();
  const { setGameInfo } = useGameContext();
  const { connect } = useGameServer({
    onGameStart(msg) {
      console.log(msg);
      navigate("/game");
      setGameInfo(msg.symbol, msg.opponent, 0);
    },
  });
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold whitespace-nowrap">
          Hi, Player!
        </h1>
        <Button
          label={isSearching ? "Looking for a game..." : "Look for a game"}
          loading={isSearching}
          onClick={() => {
            connect("data.login");
            setIsSearching(true);
          }}
        />
      </div>
      <div>
        <h2 className="mb-3 font-serif text-xl font-bold">
          Your match history
        </h2>
        <ul className="space-y-2">
          <MatchHistoryEntry
            opponent="Player"
            date="28.12.2023"
            duration="3min 12s"
            outcome="WIN"
          />
          <MatchHistoryEntry
            opponent="Player"
            date="28.12.2023"
            duration="3min 12s"
            outcome="DRAW"
          />
          <MatchHistoryEntry
            opponent="Player"
            date="28.12.2023"
            duration="3min 12s"
            outcome="LOSE"
          />
        </ul>
      </div>
    </div>
  );
}

function MatchHistoryEntry({
  opponent,
  date,
  duration,
  outcome,
}: {
  opponent: string;
  date: string;
  duration: string;
  outcome: "WIN" | "LOSE" | "DRAW";
}) {
  return (
    <li>
      <p className="flex justify-between text-sm text-gray-600">
        <span>{date}</span>
        <span>{duration}</span>
      </p>
      <p className="flex justify-between">
        <span>
          <span className="text-xs font-bold text-gray-500">vs</span> {opponent}
        </span>
        <span
          className={clsx(
            "font-bold uppercase",
            outcome === "WIN" && "text-green-700",
            outcome === "LOSE" && "text-red-700",
            outcome === "DRAW" && "text-gray-700",
          )}
        >
          {outcome}
        </span>
      </p>
    </li>
  );
}
