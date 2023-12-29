import express from "express";
import ViteExpress from "vite-express";
import { WebSocket, WebSocketServer } from "ws";
import { z } from "zod";

import { GameBoardState } from "../types.js";

const app = express();
const wss = new WebSocketServer({ port: 8080 });

ViteExpress.listen(app, 3000, () => {
  console.log("Server is listening on port 3000...");
});

const moveSchema = z.object({
  action: z.literal("move"),
  x: z.number(),
  y: z.number(),
});

const connectSchema = z.object({
  action: z.literal("connect"),
  name: z.string(),
});

const eventSchema = z.union([moveSchema, connectSchema]);

class Player {
  public match: Match | null = null;

  constructor(
    public socket: WebSocket,
    public username: string,
  ) {
    this.socket.on("message", (msg) => {
      const event = eventSchema.parse(JSON.parse(msg.toString()));

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

const matches: Match[] = [];

class Match {
  private pX: Player;
  private pO: Player;
  private state: GameBoardState;
  private currentPlayer: Player;
  private turn: number = 0;

  constructor(players: readonly [Player, Player]) {
    const index = Math.round(Math.random());
    this.pX = players[index];
    this.pO = players[(index + 1) % 2];

    this.state = [...Array(3)].map(() => [...Array(3)]);

    this.pX.send("start", { symbol: "X", opponent: this.pO.username });
    this.pO.send("start", { symbol: "O", opponent: this.pX.username });

    this.pX.match = this;
    this.pO.match = this;

    this.currentPlayer = this.pX;
  }

  onMove(player: Player, x: number, y: number) {
    if (player === this.currentPlayer) {
      console.log(player, x, y);

      this.turn++;
      this.state[y][x] = this.getSymbol();
      this.pX.send("move", { x, y, symbol: this.getSymbol(), turn: this.turn });
      this.pO.send("move", { x, y, symbol: this.getSymbol(), turn: this.turn });
      this.togglePlayer();

      this.checkBoard();
    }
  }

  private checkBoard() {
    if (this.turn >= 9) {
      this.pX.send("draw");
      this.pO.send("draw");
    }
  }

  private getSymbol() {
    return this.currentPlayer === this.pX ? "X" : "O";
  }

  private togglePlayer() {
    if (this.currentPlayer === this.pX) {
      this.currentPlayer = this.pO;
    } else {
      this.currentPlayer = this.pX;
    }
  }
}

class MatchmakingQueue {
  private queue: Player[] = [];

  contains(p: Player): boolean {
    return this.queue.some((el) => el.socket === p.socket);
  }

  append(p: Player) {
    if (!this.contains(p)) {
      this.queue.push(p);

      if (this.queue.length >= 2) {
        const [p1, p2] = this.queue;
        this.remove(p1);
        this.remove(p2);
        matches.push(new Match([p1, p2]));
      }
    }
  }

  remove(p: Player) {
    this.queue = this.queue.filter((el) => el.socket !== p.socket);
  }
}

const matchmakingQueue = new MatchmakingQueue();

wss.on("connection", (socket) => {
  socket.on("message", (msg) => {
    const event = eventSchema.parse(JSON.parse(msg.toString()));

    if (event.action === "connect") {
      const player = new Player(socket, event.name);
      matchmakingQueue.append(player);
      socket.on("close", () => matchmakingQueue.remove(player));
    }
  });
});
