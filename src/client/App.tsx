import { useState } from "react";
import { GameContext } from "./contexts/GameContext";
import { GameSymbol } from "../types";
import { RouterProvider, createMemoryRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import RegisterPage from "./pages/RegisterPage";
import MainMenuPage from "./pages/MainMenuPage";

const router = createMemoryRouter(
  [
    { path: "/", element: <MainMenuPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/game", element: <GamePage /> },
  ],
  { initialEntries: ["/login"] }
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
