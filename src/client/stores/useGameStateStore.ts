import { create } from "zustand";

import { GameSymbol } from "@/shared/types";

export const useGameStateStore = create<{
  opponent?: string;
  symbol?: GameSymbol;
  turn?: number;
  setGameInfo: (
    values: Partial<{ opponent: string; symbol: GameSymbol; turn: number }>,
  ) => void;
}>((set) => ({
  opponent: undefined,
  symbol: undefined,
  turn: undefined,
  setGameInfo: (values) => set(values),
}));
