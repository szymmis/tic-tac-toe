import cookie from "cookie";
import { UnauthorizedError } from "errors.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UsersService, { User } from "services/UsersService.js";

const AUTH_COOKIE_NAME = "auth_token";
const JWT_SECRET = "PRIVATE_KEY";

export default class AuthService {
  static setCookie(user: User, res: Response) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    res.cookie(AUTH_COOKIE_NAME, token, {
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true,
    });
  }

  static clearCookie(res: Response) {
    res.cookie(AUTH_COOKIE_NAME, "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  }

  static verify(token: string) {
    return jwt.verify(token, JWT_SECRET) as { id: number } | null;
  }

  static async getUserFromRequest(req: Request) {
    const token = this.verify(req.cookies[AUTH_COOKIE_NAME]);
    if (token) {
      return UsersService.findById(token.id);
    } else {
      throw new UnauthorizedError();
    }
  }

  static getTokenFromCookieHeader(header: string | undefined) {
    return header ? cookie.parse(header)[AUTH_COOKIE_NAME] : undefined;
  }
}
