import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGameStateStore } from "stores/useGameStateStore";
import { useMeStore } from "stores/useMeStore";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import useLogout from "@/hooks/api/mutations/useLogout";
import useGameServer from "@/hooks/useGameServer";

export default function MainMenuPage() {
  const navigate = useNavigate();
  const { setGameInfo } = useGameStateStore();
  const { user } = useMeStore();
  const { mutate: logout } = useLogout();
  const { connect } = useGameServer({
    onGameStart(msg) {
      navigate("/game");
      setGameInfo({ symbol: msg.symbol, opponent: msg.opponent, turn: 0 });
    },
  });
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <Button
          label="Logout"
          variant="secondary"
          onClick={() =>
            logout(undefined, { onSuccess: () => navigate("/login") })
          }
        />
        <Button
          label={isSearching ? "Looking for a game..." : "Look for a game"}
          loader={isSearching}
          onClick={() => {
            if (isSearching) {
              setIsSearching(false);
            } else if (user) {
              connect(user?.username);
              setIsSearching(true);
            }
          }}
        />
      </div>

      <Heading title={`Hi, ${user?.username}!`} />

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
            outcome="LOSS"
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
  outcome: "WIN" | "LOSS" | "DRAW";
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
            outcome === "LOSS" && "text-red-700",
            outcome === "DRAW" && "text-gray-700",
          )}
        >
          {outcome}
        </span>
      </p>
    </li>
  );
}
