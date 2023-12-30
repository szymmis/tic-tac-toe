import { BadRequestError } from "errors.js";
import { route } from "helpers.js";
import AuthService from "services/AuthService.js";
import HashService from "services/HashService.js";
import UsersService from "services/UsersService.js";
import { Validations } from "validations.js";

import { app } from "./main.js";

app.get(
  "/me",
  route(
    async (req) => {
      return { user: req.user };
    },
    { public: false },
  ),
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
        throw new BadRequestError(
          "Username with that login and password doesn't exist",
        );
      }

      AuthService.setCookie(user, res);
    },
    { schema: Validations.Login, public: true },
  ),
);
