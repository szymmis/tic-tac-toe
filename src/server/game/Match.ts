import { GameBoardState } from "@/shared/types.js";

import Player from "./Player.js";

export const matches: Match[] = [];

export default class Match {
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

    this.pX.send("start", { symbol: "X", opponent: this.pO.user.username });
    this.pO.send("start", { symbol: "O", opponent: this.pX.user.username });

    this.pX.match = this;
    this.pO.match = this;

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
