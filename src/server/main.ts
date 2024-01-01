import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { HttpError } from "errors.js";
import express from "express";
import { registerRoutes } from "routes.js";
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

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
const wss = new WebSocketServer({ server });
ViteExpress.bind(app, server);

const matchmakingQueue = new MatchmakingQueue();

wss.on("connection", async (socket, request) => {
  const token = AuthService.getTokenFromCookieHeader(request.headers.cookie);

  if (token) {
    try {
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
            case "move": {
              const { x, y } = event;
              player.match?.onMove(player, x, y);
              break;
            }
          }
        });

        return;
      }
    } catch (e) {
      if (!(e instanceof HttpError)) console.error(e);
      return socket.close();
    }
  }

  socket.close();
});

registerRoutes(app);

export { app, db };
