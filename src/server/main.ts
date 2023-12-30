import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import AuthService from "services/AuthService.js";
import UsersService from "services/UsersService.js";
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

wss.on("connection", async (socket, request) => {
  const token = request.headers.cookie?.split("=")[1];

  if (token) {
    const jwt = AuthService.verify(token);

    if (jwt) {
      const user = await UsersService.getById(jwt.id);
      console.log("User connected:", user);
      const player = new Player(socket, user);

      socket.on("close", () => matchmakingQueue.remove(player));

      socket.on("message", (msg) => {
        const event = ClientEventSchema.parse(JSON.parse(msg.toString()));

        switch (event.action) {
          case "enterQueue": {
            matchmakingQueue.append(player);
            break;
          }
          case "leaveQueue": {
            matchmakingQueue.remove(player);
            break;
          }
        }
      });

      return;
    }
  }

  socket.close();
});

export { app, db };

import("routes.js");
