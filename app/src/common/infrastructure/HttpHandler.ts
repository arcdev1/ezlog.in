import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import parseBody from "co-body";
import { pipe } from "@devmastery/utils";

export type FRAMEWORK = "Next";

export type Controller = (
  request: HttpRequestObject,
  enrichRequest?: (
    req: HttpRequestObject
  ) => HttpRequestObject | Promise<HttpRequestObject>
) => HttpResponseObject | Promise<HttpResponseObject>;

export class HttpHandler {
  public static for({
    framework,
    controller,
  }: {
    framework: FRAMEWORK;
    controller: Controller;
  }) {
    if (framework === "Next") {
      return new HttpHandlerNext(controller);
    }
  }

  public static getConfig({ framework }: { framework: FRAMEWORK }) {
    if (framework === "Next") {
      return {
        api: {
          bodyParser: false,
        },
      };
    }
  }
}

class HttpHandlerNext {
  #controller: Controller;

  constructor(controller: Controller) {
    this.#controller = controller;
  }

  public get handlerFn() {
    const instance = this;
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
      const send = instance.makeSender(res);
      try {
        const handle = pipe(
          instance.extractRequestObject,
          instance.#controller,
          send
        );
        await handle(req);
      } catch (e) {
        // TODO: Log
        send(internalServerError(e));
      }
    };
  }

  private makeSender(res: NextApiResponse) {
    return function send(response: HttpResponseObject) {
      res.status(response.statusCode);
      for (const key in response.headers) {
        res.setHeader(key, response.headers[key]);
      }
      res.send(
        JSON.stringify({
          meta: response.meta,
          data: response.data,
          errors: response.errors,
        })
      );
    };
  }

  private async extractRequestObject(
    req: NextApiRequest
  ): Promise<HttpRequestObject> {
    let {
      aborted,
      complete,
      headers,
      httpVersion,
      httpVersionMajor,
      httpVersionMinor,
      rawHeaders,
      rawTrailers,
      statusCode,
      statusMessage,
      trailers,
      url,
    } = req;
    let body;
    switch (headers["content-type"]) {
      case "application/json":
        body = await parseBody.json(req);
        break;

      case "application/x-www-form-urlencoded":
        body = await parseBody.form(req);
        break;

      case "multipart/form-data":
        throw new Error("Multipart/form-data not yet implemented.");

      default:
        body = await parseBody.text(req);
    }

    return {
      aborted,
      complete,
      headers,
      httpVersion,
      httpVersionMajor,
      httpVersionMinor,
      rawHeaders,
      rawTrailers,
      statusCode,
      statusMessage,
      trailers,
      url: new URL(url, `http://${headers.host}`),
      body,
      query: req.query,
      params: req.query,
      method: req.method as HttpMethod,
    };
  }

  public get config() {
    return {
      api: {
        bodyParser: false,
      },
    };
  }
}

export async function extractNextRequestObject(
  req: NextApiRequest
): Promise<HttpRequestObject> {
  let {
    aborted,
    complete,
    headers,
    httpVersion,
    httpVersionMajor,
    httpVersionMinor,
    rawHeaders,
    rawTrailers,
    statusCode,
    statusMessage,
    trailers,
    url,
  } = req;
  let body;
  switch (headers["content-type"]) {
    case "application/json":
      body = await parseBody.json(req);
      break;

    case "application/x-www-form-urlencoded":
      body = await parseBody.form(req);
      break;

    case "multipart/form-data":
      throw new Error("Multipart/form-data not yet implemented.");

    default:
      body = await parseBody.text(req);
  }

  return {
    aborted,
    complete,
    headers,
    httpVersion,
    httpVersionMajor,
    httpVersionMinor,
    rawHeaders,
    rawTrailers,
    statusCode,
    statusMessage,
    trailers,
    url: new URL(url, `http://${headers.host}`),
    body,
    query: req.query,
    params: req.query,
    method: req.method as HttpMethod,
  };
}

export function makeHttpSenderFromNext(res: NextApiResponse) {
  return function send(response: HttpResponseObject) {
    res.status(response.statusCode);
    for (const key in response.headers) {
      res.setHeader(key, response.headers[key]);
    }
    res.send(
      JSON.stringify({
        meta: response.meta,
        data: response.data,
        errors: response.errors,
      })
    );
  };
}

export interface ApiError {
  code: string;
  message: string;
}

export type HttpMethod =
  | "DELETE"
  | "GET"
  | "PATCH"
  | "POST"
  | "PUT"
  | "HEAD"
  | "OPTIONS"
  | "TRACE"
  | "CONNECT";

export interface HttpRequestObject {
  aborted: boolean;
  body?: { [key: string]: any };
  complete: boolean;
  headers: IncomingHttpHeaders;
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  method: HttpMethod;
  params?: { [key: string]: any };
  query?: { [key: string]: any };
  rawHeaders: string[];
  rawTrailers: string[];
  statusCode?: number;
  statusMessage?: string;
  trailers: NodeJS.Dict<string>;
  url?: URL;
}

export interface HttpResponseObject {
  data?: { [key: string]: any };
  headers?: OutgoingHttpHeaders;
  statusCode: StatusCode;
  statusMessage: string;
  meta?: { [key: string]: any };
  errors?: ApiError[];
  upgrading?: boolean;
  chunkedEncoding?: boolean;
  shouldKeepAlive?: boolean;
  useChunkedEncodingByDefault?: boolean;
  sendDate?: boolean;
  headersSent?: boolean;
}

export type MakeHandler<HandlerFn> = (
  formulateResponse: FormulateResponse
) => HandlerFn;

export type FormulateResponse = (
  request: HttpRequestObject
) => HttpResponseObject | Promise<HttpResponseObject>;

export function ok(
  response: Omit<HttpResponseObject, "statusCode" | "statusMessage">
) {
  return makeHttpResponse({ code: 200, response });
}

export function created(
  response: Omit<HttpResponseObject, "statusCode" | "statusMessage">
) {
  return makeHttpResponse({ code: 201, response });
}

export function accepted(
  response: Omit<HttpResponseObject, "statusCode" | "statusMessage">
) {
  return makeHttpResponse({ code: 202, response });
}

function makeHttpResponse({
  response,
  code,
}: {
  response?: Omit<HttpResponseObject, "statusCode" | "statusMessage">;
  code: StatusCode;
}) {
  return Object.freeze({
    ...response,
    ...getHttpStatus(code),
  });
}

export function internalServerError(e?: Error) {
  const status = getHttpStatus(500);
  const apiError = e
    ? {
        code: e.name,
        message: e.message,
      }
    : {
        code: String(status.statusCode),
        message: status.statusMessage,
      };
  return Object.freeze({
    ...getHttpStatus(500),
    errors: [apiError],
  });
}

export function badRequest(e: ApiError | ApiError[]) {
  return Object.freeze({
    errors: Array.isArray(e) ? e : [e],
    ...getHttpStatus(400),
  });
}

export function notFound() {
  const status = getHttpStatus(404);
  return Object.freeze({
    errors: [
      {
        code: status.statusCode,
        message: status.statusMessage,
      },
    ],
    ...status,
  });
}

export function methodNotAllowed({
  allow,
}: {
  allow: string | Array<string>;
}): Readonly<HttpResponseObject> {
  const status = getHttpStatus(405);
  return Object.freeze({
    ...status,
    headers: {
      Allow: Array.isArray(allow) ? allow.join() : allow,
    },
    errors: [
      {
        code: String(status.statusCode),
        message: status.statusMessage,
      },
    ],
  });
}

export function unsupportedMediaType({
  accept,
}: {
  accept: string | Array<string>;
}) {
  const status = getHttpStatus(415);
  return Object.freeze({
    ...status,
    headers: {
      Accept: Array.isArray(accept) ? accept.join() : accept,
    },
    errors: [
      {
        code: String(status.statusCode),
        message: status.statusMessage,
      },
    ],
  });
}

const httpStatuses = new Map<StatusCode, string>([
  [100, "Continue"],
  [101, "Switching Protocols"],
  [102, "Processing"],
  [200, "OK"],
  [201, "Created"],
  [202, "Accepted"],
  [203, "Non-authoritative Information"],
  [204, "No Content"],
  [205, "Reset Content"],
  [206, "Partial Content"],
  [207, "Multi-Status"],
  [208, "Already Reported"],
  [226, "IM Used"],
  [300, "Multiple Choices"],
  [301, "Moved Permanently"],
  [302, "Found"],
  [303, "See Other"],
  [304, "Not Modified"],
  [305, "Use Proxy"],
  [307, "Temporary Redirect"],
  [308, "Permanent Redirect"],
  [400, "Bad Request"],
  [401, "Unauthorized"],
  [402, "Payment Required"],
  [403, "Forbidden"],
  [404, "Not Found"],
  [405, "Method Not Allowed"],
  [406, "Not Acceptable"],
  [407, "Proxy Authentication Required"],
  [408, "Request Timeout"],
  [409, "Conflict"],
  [410, "Gone"],
  [411, "Length Required"],
  [412, "Precondition Failed"],
  [413, "Payload Too Large"],
  [414, "Request-Uri Too Long"],
  [415, "Unsupported Media Type"],
  [416, "Requested Range Not Satisfiable"],
  [417, "Expectation Failed"],
  [418, "I'm a teapot"],
  [421, "Misdirected Request"],
  [422, "Unprocessable Entity"],
  [423, "Locked"],
  [424, "Failed Dependency"],
  [426, "Upgrade Required"],
  [428, "Precondition Required"],
  [429, "Too Many Requests"],
  [431, "Request Header Fields Too Large"],
  [444, "Connection Closed Without Response"],
  [451, "Unavailable For Legal Reasons"],
  [499, "Client Closed Request"],
  [500, "Internal Server Error"],
  [501, "Not Implemented"],
  [502, "Bad Gateway"],
  [503, "Service Unavailable"],
  [504, "Gateway Timeout"],
  [505, "HTTP Version Not Supported"],
  [506, "Variant Also Negotiates"],
  [507, "Insufficient Storage"],
  [508, "Loop Detected"],
  [510, "Not Extended"],
  [511, "Network Authentication Required"],
  [599, "Network Connect Timeout Error"],
]);

export function getHttpStatus(code: StatusCode) {
  return {
    statusCode: code,
    statusMessage: httpStatuses.get(code),
  };
}

export type StatusCode =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 426
  | 428
  | 429
  | 431
  | 444
  | 451
  | 499
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511
  | 599;
