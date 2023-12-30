import { User } from "services/UsersService.js";
import WebSocket from "ws";

import Match from "./Match.js";

export default class Player {
  public match: Match | null = null;

  constructor(
    public socket: WebSocket,
    public user: User,
  ) {}

  send(
    action: "start" | "move" | "win" | "draw" | "loss" | "forfeit",
    data?: Record<string, unknown>,
  ) {
    this.socket.send(JSON.stringify({ action, ...data }));
  }
}
