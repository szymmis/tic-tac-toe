import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useAuthStore } from "stores/useAuthStore";

import { HistoryEntry } from "@/hooks/api/queries/useMe";

export default function MatchHistory({ history }: { history: HistoryEntry[] }) {
  return (
    <div>
      <h2 className="mb-3 font-serif text-xl font-bold">Your match history</h2>
      {history.length === 0 ? (
        <p>Your do not have any recored match history yet.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((entry) => (
            <MatchHistory.Entry key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}

MatchHistory.Entry = function Entry({ entry }: { entry: HistoryEntry }) {
  const { user } = useAuthStore();
  const outcome = !entry.winner_id
    ? "DRAW"
    : user?.id === entry.winner_id
      ? "WIN"
      : "LOSS";

  const duration = useMemo(() => {
    return {
      seconds: dayjs(entry.finished_at).diff(
        dayjs(entry.started_at),
        "seconds",
      ),
      minutes: dayjs(entry.finished_at).diff(
        dayjs(entry.started_at),
        "minutes",
      ),
    };
  }, [entry.started_at, entry.finished_at]);

  return (
    <li>
      <p className="flex justify-between text-sm text-gray-600">
        <span>{dayjs(entry.started_at).format("DD MMM YYYY")}</span>
        <span>
          {duration.minutes > 0
            ? `${duration.minutes}min ${duration.seconds}s`
            : `${duration.seconds}s`}
        </span>
      </p>
      <p className="flex justify-between">
        <span>
          <span className="text-xs font-bold text-gray-500">vs</span>{" "}
          {user?.id === entry.o_id ? entry.x_username : entry.o_username}
        </span>
        <span
          className={clsx(
            "font-semibold uppercase text-xs py-0.5 px-2 my-auto rounded-full",
            outcome === "WIN" && "text-green-700 bg-green-100",
            outcome === "LOSS" && "text-red-500 bg-red-100",
            outcome === "DRAW" && "text-gray-600 bg-gray-200",
          )}
        >
          {outcome}
        </span>
      </p>
    </li>
  );
};
