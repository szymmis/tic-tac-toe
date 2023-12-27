import { useMemo, useState } from "react";
import { RotuerContext, Route } from "../contexts/RouterContext";
import LoginPage from "../pages/LoginPage";
import WaitingPage from "../pages/WaitingPage";
import GamePage from "../pages/GamePage";

export default function Router() {
  const [route, setRoute] = useState<Route>("login");

  const page = useMemo(() => {
    switch (route) {
      case "login":
        return <LoginPage />;
      case "waiting":
        return <WaitingPage />;
      case "game":
        return <GamePage />;
    }
  }, [route]);

  return (
    <RotuerContext.Provider
      value={{
        route,
        navigate(route) {
          setRoute(route);
        },
      }}
    >
      {page}
    </RotuerContext.Provider>
  );
}
