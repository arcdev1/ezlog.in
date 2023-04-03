import { type NextApiResponse } from "next";
import { ApiError, sendApiError } from "./api-error";

export interface ApiResultParams<T extends Record<string, unknown>> {
  status: number;
  data?: T;
  headers?: Map<string, string>;
  error?: ApiError;
}

export class ApiResult<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  status: number;
  data?: T;
  headers?: Map<string, string> = new Map();
  error?: ApiError;
  constructor({ status, data, headers, error }: ApiResultParams<T>) {
    this.status = status;
    this.data = data;
    this.headers = headers;
    this.error = error;
  }

  static ok<T extends Record<string, unknown> = Record<string, unknown>>(
    data?: T
  ) {
    return new ApiResult({ status: 200, data });
  }

  static created<T extends Record<string, unknown> = Record<string, unknown>>(
    data?: T
  ) {
    return new ApiResult({ status: 201, data });
  }

  static accepted<T extends Record<string, unknown> = Record<string, unknown>>(
    data?: T
  ) {
    return new ApiResult({ status: 202, data });
  }

  static noContent() {
    return new ApiResult({ status: 204 });
  }

  static notModified() {
    return new ApiResult({ status: 304 });
  }

  static redirect<T extends Record<string, unknown> = Record<string, unknown>>({
    data,
    location,
    type = "temporary",
  }: {
    data?: T;
    location: string | URL;
    type: "temporary" | "permanent" | "found" | "see-other";
  }) {
    switch (type) {
      case "temporary":
        return ApiResult.temporaryRedirect({ data, location });

      case "permanent":
        return ApiResult.permanentRedirect({ data, location });

      case "see-other":
        return ApiResult.seeOther({ data, location });

      case "found":
        return ApiResult.found({ data, location });

      default:
        break;
    }
  }

  static found<T extends Record<string, unknown> = Record<string, unknown>>({
    data,
    location,
  }: {
    data?: T;
    location: string | URL;
  }) {
    return new ApiResult({
      status: 302,
      data,
      headers: new Map([["Location", location.toString()]]),
    });
  }

  static seeOther<T extends Record<string, unknown> = Record<string, unknown>>({
    data,
    location,
  }: {
    data?: T;
    location: string | URL;
  }) {
    return new ApiResult({
      status: 303,
      data,
      headers: new Map([["Location", location.toString()]]),
    });
  }

  static temporaryRedirect<
    T extends Record<string, unknown> = Record<string, unknown>
  >({ data, location }: { data?: T; location: string | URL }) {
    return new ApiResult({
      status: 307,
      data,
      headers: new Map([["Location", location.toString()]]),
    });
  }

  static permanentRedirect<
    T extends Record<string, unknown> = Record<string, unknown>
  >({ data, location }: { data?: T; location: string | URL }) {
    return new ApiResult({
      status: 308,
      data,
      headers: new Map([["Location", location.toString()]]),
    });
  }

  static withHeaders<
    T extends Record<string, unknown> = Record<string, unknown>
  >({ data, headers }: { data?: T; headers: Map<string, string> }) {
    return new ApiResult({ status: 200, data, headers });
  }

  static withHeader<
    T extends Record<string, unknown> = Record<string, unknown>
  >({ data, key, value }: { data?: T; key: string; value: string }) {
    return new ApiResult({
      status: 200,
      data,
      headers: new Map([[key, value]]),
    });
  }

  static withCookie<
    T extends Record<string, unknown> = Record<string, unknown>
  >({
    data,
    key,
    value,
    options,
  }: {
    data?: T;
    key: string;
    value: string;
    options?: {
      domain?: string;
      expires?: Date;
      httpOnly?: boolean;
      maxAge?: number;
      path?: string;
      sameSite?: boolean | "Lax" | "Strict" | "None";
      secure?: boolean;
      signed?: boolean;
    };
  }) {
    const cookie = `${key}=${value}`;
    const cookieWithOptions = Object.entries(options ?? {}).reduce(
      (acc, [k, v]) => {
        return `${acc}; ${k}=${String(v)}`;
      },
      cookie
    );
    return new ApiResult({
      status: 200,
      data,
      headers: new Map([["Set-Cookie", cookieWithOptions]]),
    });
  }

  static fromError(error: Error) {
    const apiError = ApiError.fromError(error);
    return new ApiResult({
      status: apiError.status,
      error: apiError,
    });
  }
}

export function sendApiResult<
  T extends Record<string, unknown> = Record<string, unknown>
>({ res, apiResult }: { res: NextApiResponse; apiResult: ApiResult<T> }) {
  if (apiResult.error) {
    return sendApiError({ res, error: apiResult.error });
  }

  if (apiResult.headers) {
    apiResult.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
  }
  if (apiResult.data == null) {
    return res.status(apiResult.status).end();
  }
  return res.status(apiResult.status).json(apiResult.data);
}
