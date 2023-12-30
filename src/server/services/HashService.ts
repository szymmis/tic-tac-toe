import bcrypt from "bcrypt";

export default class HashService {
  static async hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  static async check(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}
