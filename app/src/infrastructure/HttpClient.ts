import fetch from "cross-fetch";
import { Result } from "../entities/Result";
import { HttpClient } from "../services";

class HttpClientImpl implements HttpClient {
  constructor() {}
  public async get(
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) {
    return this.doFetch(requestInfo, {
      ...options,
      method: "GET",
    });
  }
  public async patch(
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) {
    return this.doFetch(requestInfo, { ...options, method: "POST" });
  }
  public async post(
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) {
    return this.doFetch(requestInfo, { ...options, method: "POST" });
  }
  public async put(
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) {
    return this.doFetch(requestInfo, { ...options, method: "POST" });
  }

  private async doFetch(requestInfo: RequestInfo, options: RequestInit) {
    try {
      let response = await fetch(requestInfo, options);
      if (response.ok) {
        return Result.succeed(response);
      } else {
        return Result.fail([new HttpClientResponseError(response)]);
      }
    } catch (e) {
      //TODO: Implement retry and/or offline logic.
      //throw new HttpClientNetworkError(e);
      throw e;
    }
  }
}

const httpClient = new HttpClientImpl();
export { httpClient };

export class HttpClientResponseError extends Error {
  #response: Response;
  constructor(response: Response) {
    super("Received a non-2xx response.");
    this.#response = response;
  }
  public get response() {
    return this.#response;
  }
}

export class HttpClientNetworkError extends Error {
  #cause: Error;
  constructor(cause: Error) {
    super("");
    this.#cause = cause;
  }
  public get cause() {
    return this.#cause;
  }
}
