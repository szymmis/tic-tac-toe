import { useState } from "react";
import Router from "./components/Router";
import { GameContext } from "./contexts/GameContext";
import { GameSymbol } from "../types";

export default function App() {
  const [state, setState] = useState<{
    opponent?: string;
    symbol?: GameSymbol;
    turn?: number;
  }>({});

  return (
    <GameContext.Provider
      value={{
        opponent: state.opponent,
        symbol: state.symbol,
        turn: state.turn,
        setGameInfo(symbol, opponent, turn) {
          setState({ symbol, opponent, turn });
        },
      }}
    >
      <Router />
    </GameContext.Provider>
  );
}
