import { NotFoundError } from "errors.js";
import HashService from "services/HashService.js";

import { db } from "../main.js";

export type User = {
  id: number;
  username: string;
  password: string;
};

export default class UsersService {
  static async getById(id: number) {
    const user = await db.get<User>("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) {
      throw new NotFoundError(`User with (id=${id}) not found`);
    }
    return user;
  }

  static async findByUsername(username: string) {
    return await db.get<User>("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
  }

  static async create(username: string, password: string) {
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      await HashService.hash(password),
    ]);
  }
}
