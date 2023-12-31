import { rm } from "fs/promises";
import request from "supertest";
import { afterAll, describe, test } from "vitest";

import { app } from "../server/main.js";

describe("rest api tests", () => {
  test("cannot access /me unauthorized", async () => {
    await request(app).get("/me").expect(401);
  });

  test("cannot login into non existing account", async () => {
    await request(app)
      .post("/login")
      .send({ login: "test", password: "test" })
      .expect(404, {
        code: 404,
        message: "User with that login and password doesn't exist",
      });
  });

  test("can register an account", async () => {
    await request(app)
      .post("/register")
      .send({ login: "test", password: "test" })
      .expect(200);
  });

  let token!: string;

  test("can login into created account", async () => {
    await request(app)
      .post("/login")
      .send({ login: "test", password: "test" })
      .expect(200)
      .then((res) => (token = res.headers["set-cookie"]));

    await request(app).get("/me").set("Cookie", [token]).expect(200);
  });

  test("can fetch the account data", async () => {
    await request(app)
      .get("/me")
      .set("Cookie", [token])
      .expect(200, { user: { id: 1, username: "test" }, history: [] });
  });

  test("can logout", async () => {
    await request(app).post("/logout").set("Cookie", [token]).expect(200);
  });
});

afterAll(async () => {
  if (process.env["DB_FILE"]) {
    await rm(process.env["DB_FILE"]);
  }
});
