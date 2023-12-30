import { useGameStateStore } from "stores/useGameStateStore";

export default function useIsYourTurn() {
  const { symbol, turn } = useGameStateStore();
  return turn !== undefined && turn % 2 === (symbol === "X" ? 0 : 1);
}
