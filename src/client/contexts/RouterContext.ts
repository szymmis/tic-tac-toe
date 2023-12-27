import React, { useContext } from "react";

export type Route = "login" | "waiting" | "game";

export const RotuerContext = React.createContext(
  {} as { route: string; navigate: (route: Route) => void }
);

export function useRouter() {
  return useContext(RotuerContext);
}
