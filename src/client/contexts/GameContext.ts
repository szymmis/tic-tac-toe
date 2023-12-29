import React, { useContext } from "react";

import { GameSymbol } from "@/shared/types";

export const GameContext = React.createContext(
  {} as {
    opponent: string | undefined;
    symbol: GameSymbol | undefined;
    turn: number | undefined;
    setGameInfo: (symbol: GameSymbol, opponent: string, turn: number) => void;
  },
);

export function useGameContext() {
  return useContext(GameContext);
}
