import { BadRequestError, NotFoundError } from "errors.js";
import { Express } from "express-serve-static-core";
import { route } from "helpers.js";
import AuthService from "services/AuthService.js";
import HashService from "services/HashService.js";
import MatchHistoryService from "services/MatchHistoryService.js";
import UsersService from "services/UsersService.js";
import { Validations } from "validations.js";

export function registerRoutes(app: Express) {
  app.get(
    "/me",
    route(async (req) => {
      const { password, ...user } = req.user;
      const history = await MatchHistoryService.getByUserId(user.id);
      return { user, history };
    }),
  );

  app.post(
    "/register",
    route(
      async (req) => {
        if (await UsersService.findByUsername(req.body.login)) {
          throw new BadRequestError("Username is already taken");
        }

        await UsersService.create(req.body.login, req.body.password);
      },
      { schema: Validations.Register, public: true },
    ),
  );

  app.post(
    "/login",
    route(
      async (req, res) => {
        const user = await UsersService.findByUsername(req.body.login);

        if (
          !user ||
          !(await HashService.check(req.body.password, user.password))
        ) {
          throw new NotFoundError(
            "User with that login and password doesn't exist",
          );
        }

        AuthService.setCookie(user, res);

        const { password, ...userProps } = user;
        return userProps;
      },
      { schema: Validations.Login, public: true },
    ),
  );

  app.post(
    "/logout",
    route(async (req, res) => {
      AuthService.clearCookie(res);
    }),
  );
}
