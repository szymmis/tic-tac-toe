import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "stores/useAuthStore";
import { useGameStateStore } from "stores/useGameStateStore";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import useLogout from "@/hooks/api/mutations/useLogout";
import useMe, { HistoryEntry } from "@/hooks/api/queries/useMe";
import useGameServer from "@/hooks/useGameServer";

export default function MainMenuPage() {
  const { data } = useMe();

  const navigate = useNavigate();
  const { setGameInfo } = useGameStateStore();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { enterQueue, leaveQueue } = useGameServer({
    onGameStart(msg) {
      navigate("/game");
      setGameInfo({ symbol: msg.symbol, opponent: msg.opponent, turn: 0 });
    },
  });
  const [isSearching, setIsSearching] = useState(false);

  console.log(data?.history);

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
              leaveQueue();
            } else if (user) {
              setIsSearching(true);
              enterQueue();
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
          {data?.history.map((entry) => (
            <MatchHistoryEntry key={entry.id} entry={entry} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function MatchHistoryEntry({ entry }: { entry: HistoryEntry }) {
  const { user } = useAuthStore();
  const outcome = !entry.winner_id
    ? "DRAW"
    : user?.id === entry.winner_id
      ? "WIN"
      : "LOSS";

  return (
    <li>
      <p className="flex justify-between text-sm text-gray-600">
        <span>
          {entry.started_at.split("T")[0].split("-").toReversed().join(".")}
        </span>
        <span>
          {new Date(entry.finished_at).getTime() -
            new Date(entry.started_at).getTime()}{" "}
          ms
        </span>
      </p>
      <p className="flex justify-between">
        <span>
          <span className="text-xs font-bold text-gray-500">vs</span>{" "}
          {user?.id === entry.o_id ? entry.x_username : entry.o_username}
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
