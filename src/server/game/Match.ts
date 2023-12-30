import MatchHistoryService from "services/MatchHistoryService.js";

import { GameBoardState, GameSymbol } from "@/shared/types.js";

import Player from "./Player.js";

export const matches: Match[] = [];

export default class Match {
  private pX: Player;
  private pO: Player;
  private startedAt = new Date();
  private state: GameBoardState;
  private currentPlayer: Player;
  private turn: number = 0;

  constructor(players: readonly [Player, Player]) {
    const index = Math.round(Math.random());
    this.pX = players[index];
    this.pO = players[(index + 1) % 2];

    this.state = [...Array(3)].map(() => [...Array(3)]);

    this.pX.send("start", { symbol: "X", opponent: this.pO.user.username });
    this.pO.send("start", { symbol: "O", opponent: this.pX.user.username });

    this.pX.match = this;
    this.pO.match = this;

    this.pX.socket.once("close", () => this.forfeit(this.pX));
    this.pO.socket.once("close", () => this.forfeit(this.pO));

    console.log(
      "Match started:",
      this.pX.user.username,
      "vs",
      this.pO.user.username,
    );

    this.currentPlayer = this.pX;
  }

  onMove(player: Player, x: number, y: number) {
    if (player === this.currentPlayer) {
      console.log(player.user.username, x, y);

      this.turn++;
      this.state[y][x] = this.getSymbol();
      this.pX.send("move", { x, y, symbol: this.getSymbol(), turn: this.turn });
      this.pO.send("move", { x, y, symbol: this.getSymbol(), turn: this.turn });
      this.togglePlayer();

      this.checkBoard();
    }
  }

  private checkBoard() {
    for (let y = 0; y < 3; y++) {
      if (
        this.state[y][0] !== undefined &&
        this.state[y][0] === this.state[y][1] &&
        this.state[y][1] === this.state[y][2]
      ) {
        return this.win(this.state[y][0]!);
      }
    }

    for (let x = 0; x < 3; x++) {
      if (
        this.state[0][x] !== undefined &&
        this.state[0][x] === this.state[1][x] &&
        this.state[1][x] === this.state[2][x]
      ) {
        return this.win(this.state[0][x]!);
      }
    }

    if (
      this.state[0][0] !== undefined &&
      this.state[0][0] === this.state[1][1] &&
      this.state[1][1] === this.state[2][2]
    ) {
      return this.win(this.state[0][0]);
    }

    if (
      this.state[0][2] !== undefined &&
      this.state[0][2] === this.state[1][1] &&
      this.state[1][1] === this.state[2][0]
    ) {
      return this.win(this.state[0][2]);
    }

    if (this.turn >= 9) {
      this.draw();
    }
  }

  private win(winningSymbol: GameSymbol) {
    if (winningSymbol === "X") {
      this.pX.send("win");
      this.pO.send("loss");
    } else {
      this.pX.send("loss");
      this.pO.send("win");
    }

    MatchHistoryService.create(
      this.pX,
      this.pO,
      this.startedAt,
      new Date(),
      winningSymbol === "X" ? this.pX.user.id : this.pO.user.id,
    );
  }

  private draw() {
    this.pX.send("draw");
    this.pO.send("draw");

    MatchHistoryService.create(
      this.pX,
      this.pO,
      this.startedAt,
      new Date(),
      null,
    );
  }

  private forfeit(forfeitingPlayer: Player) {
    if (forfeitingPlayer.match !== this) return;

    if (forfeitingPlayer === this.pX) {
      this.pX.send("forfeit");
      this.pX.match = null;
    } else {
      this.pO.send("forfeit");
      this.pO.match = null;
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
