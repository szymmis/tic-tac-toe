import { GameSymbol } from "../../types";
import useWebSocket from "./useWebSocket";

export default function useGameServer({
  onGameStart,
  onMove,
}: {
  onGameStart?: (msg: unknown) => void;
  onMove?: (x: number, y: number, symbol: GameSymbol, turn: number) => void;
}) {
  const socket = useWebSocket({
    hostname: location.hostname,
    port: 8080,
    onMessage(msg) {
      if ("action" in (msg as object)) {
        switch ((msg as Record<string, unknown>)["action"]) {
          case "start":
            onGameStart?.(msg);
            break;
          case "move": {
            //TODO: Add Zod validation for those objects
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { x, y, symbol, turn } = msg as any;
            onMove?.(x, y, symbol, turn);
            break;
          }
        }
      }
    },
  });

  return {
    connect: (name: string) => {
      socket.send({ action: "connect", name });
    },
    move: (x: number, y: number) => {
      socket.send({ action: "move", x, y });
    },
  };
}
