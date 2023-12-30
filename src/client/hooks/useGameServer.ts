import { ServerEventSchema, ServerStartEventType } from "@/shared/schemas";
import { GameSymbol } from "@/shared/types";

import useWebSocket from "./useWebSocket";

export default function useGameServer({
  onGameStart,
  onMove,
}: {
  onGameStart?: (msg: ServerStartEventType) => void;
  onMove?: (x: number, y: number, symbol: GameSymbol, turn: number) => void;
}) {
  const socket = useWebSocket({
    hostname: location.hostname,
    port: 8080,
    onMessage(msg) {
      const data = ServerEventSchema.parse(msg);
      switch (data.action) {
        case "start":
          onGameStart?.(data);
          break;
        case "move": {
          const { x, y, symbol, turn } = data;
          onMove?.(x, y, symbol, turn);
          break;
        }
      }
    },
  });

  return {
    enterQueue: () => {
      socket.send({ action: "enterQueue" });
    },
    leaveQueue: () => {
      socket.send({ action: "leaveQueue" });
    },
    move: (x: number, y: number) => {
      socket.send({ action: "move", x, y });
    },
  };
}
