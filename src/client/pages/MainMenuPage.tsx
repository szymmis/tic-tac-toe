import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "stores/useAuthStore";
import { useGameStateStore } from "stores/useGameStateStore";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import MatchHistory from "@/components/MatchHistory";
import useLogout from "@/hooks/api/mutations/useLogout";
import useMe from "@/hooks/api/queries/useMe";
import useGameServer from "@/hooks/useGameServer";

export default function MainMenuPage() {
  const { data, isLoading } = useMe();

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

  return (
    <div className="self-start flex-1 max-w-md space-y-4 md:self-center">
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

      {isLoading ? (
        <Loader size={32} />
      ) : (
        <MatchHistory history={data?.history ?? []} />
      )}
    </div>
  );
}
