import { useState } from "react";
import { GameContext } from "./contexts/GameContext";
import { GameSymbol } from "../types";
import { RouterProvider, createMemoryRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import WaitingPage from "./pages/WaitingPage";
import GamePage from "./pages/GamePage";

const router = createMemoryRouter(
  [
    { path: "/", element: <LoginPage /> },
    { path: "/matchmaking", element: <WaitingPage /> },
    { path: "/game", element: <GamePage /> },
  ],
  { initialEntries: ["/"] }
);

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
      <RouterProvider router={router} />
    </GameContext.Provider>
  );
}
