import React from "react";

export const GameContext = React.createContext(
  {} as { onGameMove: (x: number, y: number) => void }
);
