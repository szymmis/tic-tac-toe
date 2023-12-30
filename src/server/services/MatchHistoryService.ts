import db from "db.js";
import Player from "game/Player.js";

export default class MatchHistoryService {
  static getByUserId(userId: number) {
    return db.all(
      "SELECT match_history.*, u1.username as x_username, u2.username as o_username FROM match_history JOIN users as u1 ON match_history.x_id = u1.id JOIN users as u2 ON match_history.o_id = u2.id WHERE x_id = ? OR o_id = ?",
      [userId, userId],
    );
  }

  static async create(
    p1: Player,
    p2: Player,
    startedAt: Date,
    finishedAt: Date,
    winnerId: number | null,
  ) {
    await db.run(
      "INSERT INTO match_history (x_id, o_id, started_at, finished_at, winner_id) VALUES (?, ?, ?, ?, ?)",
      [
        p1.user.id,
        p2.user.id,
        startedAt.toISOString(),
        finishedAt.toISOString(),
        winnerId,
      ],
    );
  }
}
