import { HttpError } from "errors.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AuthService from "services/AuthService.js";
import { User } from "services/UsersService.js";
import { z, ZodError, ZodSchema } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InferedRequest<T extends ZodSchema> = Request<any, any, z.infer<T>>;
type InferedRequestWithUser<
  T extends ZodSchema,
  P extends boolean,
> = InferedRequest<T> & { user: P extends true ? User | undefined : User };

export function route<T extends ZodSchema, P extends boolean = false>(
  fn: (
    req: InferedRequestWithUser<T, P>,
    res: Response,
  ) => unknown | Promise<unknown>,
  options?: {
    public?: P;
    schema?: T;
  },
) {
  return async (req: Request, res: Response) => {
    try {
      if (req.cookies["auth_token"]) {
        const user = await AuthService.getUserFromRequest(req);
        (req as Request & { user: User }).user = user;
      } else if (!options?.public) {
        throw new HttpError(401, "Unauthorized");
      }
    } catch (e) {
      if (!options?.public) {
        if (e instanceof HttpError) {
          return res.status(e.code).send(e.toJSON());
        } else if (e instanceof jwt.JsonWebTokenError) {
          return res.status(401).send({ message: "Unauthorized" });
        } else {
          console.error(e);
          return res.status(500).end();
        }
      }
    }

    try {
      if (options?.schema) req.body = options.schema.parse(req.body);
      //@ts-expect-error We can avoid casting this request to InferedRequest
      res.send(await fn(req, res));
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).send(e.issues);
      } else if (e instanceof HttpError) {
        res.status(e.code).send(e.toJSON());
      } else {
        console.error(e);
        res.status(500).end();
      }
    }
  };
}
