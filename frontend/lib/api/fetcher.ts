// src/lib/api/fetcher.ts
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type FetcherOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function fetcher<T>(
  input: string,
  options: FetcherOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers,
    cache = "no-store",
    next,
    credentials = "include",
    signal,
  } = options;

  const response = await fetch(input, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
    credentials,
    signal,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Request failed";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
