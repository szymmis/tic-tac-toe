async function api(url: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(url, { ...init, credentials: "include" });

  if (!response.ok) throw new RequestError(response);

  return await response.json().catch(() => {});
}

export class ApiService {
  static async get(url: string) {
    return api(url, { method: "GET" });
  }

  static async post(url: string, body: Record<string, unknown>) {
    return api(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export class RequestError extends Error {
  public code: number;

  constructor(response: Response) {
    super(response.statusText);
    this.code = response.status;
  }
}
