import express from "express";
import ViteExpress from "vite-express";
import { WebSocket, WebSocketServer } from "ws";
import { z } from "zod";
import { GameBoardState, GameSymbol } from "../types.js";

const app = express();

ViteExpress.listen(app, 3000, () => {
  console.log("Server is listening on port 3000...");
});

const gameState: GameBoardState = [...Array(3)].map(() => [...Array(3)]);
let currentSymbol: GameSymbol = "X";
let players: Player[] = [];

const wss = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
  console.log("WSS is listening on port 8080...");
});

const moveEventSchema = z.object({
  action: z.literal("move"),
  payload: z.object({ x: z.number(), y: z.number() }),
});

const authEventSchema = z.object({
  action: z.literal("auth"),
  payload: z.object({ key: z.string() }),
});

const eventSchema = z.union([moveEventSchema, authEventSchema]);

class Player {
  constructor(public socket: WebSocket, public symbol: GameSymbol) {
    this.socket.on("message", (msg) => {
      const event = eventSchema.parse(JSON.parse(msg.toString()));
      console.log(event);
      if (event.action === "move" && currentSymbol == this.symbol) {
        players.forEach((s) =>
          s.socket.send(
            JSON.stringify({
              action: "move",
              payload: { ...event.payload, symbol: this.symbol },
            })
          )
        );

        currentSymbol = currentSymbol === "X" ? "O" : "X";
      }
    });
  }
}

wss.on("connection", (socket) => {
  if (players.length < 2) {
    players.push(new Player(socket, players.length === 1 ? "X" : "O"));
    console.log(`Player #${players.length} has joined!`);
    socket.send(`Hello player #${players.length}`);

    socket.on("close", () => {
      console.log("Player has disconnected");
      players = players.filter((s) => s.socket !== socket);
    });
  } else {
    socket.close();
  }
});
