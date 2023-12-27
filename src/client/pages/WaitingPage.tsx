import Loader from "../components/Loader";
import { useGameContext } from "../contexts/GameContext";
import { useRouter } from "../contexts/RouterContext";
import useGameServer from "../hooks/useGameServer";

export default function WaitingPage() {
  const { navigate } = useRouter();
  const { setGameInfo } = useGameContext();

  useGameServer({
    onGameStart(msg) {
      console.log(msg);
      navigate("game");
      setGameInfo(msg.symbol, msg.opponent, 0);
    },
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <Loader size={64} />
      <h1 className="font-serif text-2xl font-semibold text-center">
        Waiting for opponent
      </h1>
    </div>
  );
}
