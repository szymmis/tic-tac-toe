import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UsersService, { User } from "services/UsersService.js";

const AUTH_COOKIE_NAME = "auth_token";
const JWT_SECRET = "PRIVATE_KEY";

export default class AuthService {
  static setCookie(user: User, res: Response) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    res.cookie(AUTH_COOKIE_NAME, token, {
      expires: new Date(Date.now() + 1000 * 60 * 15),
      httpOnly: true,
    });
  }

  static verify(token: string) {
    return jwt.verify(token, JWT_SECRET) as { id: number } | null;
  }

  static async getUserFromRequest(req: Request) {
    const token = this.verify(req.cookies[AUTH_COOKIE_NAME]);
    if (token) {
      return UsersService.getById(token.id);
    } else {
      throw new Error();
    }
  }
}
