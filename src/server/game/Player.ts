import WebSocket from "ws";

import { ClientEventSchema } from "@/shared/schemas.js";

import Match from "./Match.js";

export default class Player {
  public match: Match | null = null;

  constructor(
    public socket: WebSocket,
    public username: string,
  ) {
    this.socket.on("message", (msg) => {
      const event = ClientEventSchema.parse(JSON.parse(msg.toString()));

      switch (event.action) {
        case "move": {
          const { x, y } = event;
          this.match?.onMove(this, x, y);
          break;
        }
      }
    });
  }

  send(
    action: "start" | "move" | "win" | "draw" | "lose" | "forfeit",
    data?: Record<string, unknown>,
  ) {
    this.socket.send(JSON.stringify({ action, ...data }));
  }
}
