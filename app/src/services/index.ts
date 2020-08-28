import { Result } from "../entities/Result";

export interface HttpClient {
  get: (
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) => Promise<Result<Response>>;
  post: (
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) => Promise<Result<Response>>;
  put: (
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) => Promise<Result<Response>>;
  patch: (
    requestInfo: RequestInfo,
    options?: Omit<RequestInit, "method">
  ) => Promise<Result<Response>>;
}
