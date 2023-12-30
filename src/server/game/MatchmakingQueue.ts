import Match, { matches } from "./Match.js";
import Player from "./Player.js";

export default class MatchmakingQueue {
  private queue: Player[] = [];

  contains(p: Player): boolean {
    return this.queue.some((el) => el.user.id === p.user.id);
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
    this.queue = this.queue.filter((el) => el.user.id !== p.user.id);
  }
}
