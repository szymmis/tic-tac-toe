import { useState } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";

import { GameSymbol } from "../types";
import { GameContext } from "./contexts/GameContext";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import MainMenuPage from "./pages/MainMenuPage";
import RegisterPage from "./pages/RegisterPage";

const router = createMemoryRouter(
  [
    { path: "/", element: <MainMenuPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/game", element: <GamePage /> },
  ],
  { initialEntries: ["/login"] },
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
