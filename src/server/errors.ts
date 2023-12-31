export class HttpError extends Error {
  constructor(
    public code: number,
    public message: string,
  ) {
    super(`${code}: ${message}`);
  }

  toJSON() {
    return { code: this.code, message: this.message };
  }
}

export class BadRequestError extends HttpError {
  constructor(msg?: string) {
    super(400, msg ?? "Bad request");
  }
}

export class NotFoundError extends HttpError {
  constructor(msg?: string) {
    super(404, msg ?? "Not found");
  }
}

export class UnauthorizedError extends HttpError {
  constructor(msg?: string) {
    super(401, msg ?? "Unauthorized");
  }
}
