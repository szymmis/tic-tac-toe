import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import ViteExpress from "vite-express";
import { WebSocketServer } from "ws";

import { ClientEventSchema } from "@/shared/schemas.js";

import db from "./db.js";
import MatchmakingQueue from "./game/MatchmakingQueue.js";
import Player from "./game/Player.js";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(ViteExpress.static());

const wss = new WebSocketServer({ port: 8080 });

ViteExpress.listen(app, 3000, () => {
  console.log("Server is listening on port 3000...");
});

const matchmakingQueue = new MatchmakingQueue();

wss.on("connection", (socket) => {
  socket.on("message", (msg) => {
    const event = ClientEventSchema.parse(JSON.parse(msg.toString()));

    if (event.action === "connect") {
      const player = new Player(socket, event.name);
      matchmakingQueue.append(player);
      socket.on("close", () => matchmakingQueue.remove(player));
    }
  });
});

export { app, db };

import("routes.js");
