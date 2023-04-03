import { type NextApiResponse } from "next";
import { z } from "zod";

interface ApiErrorParams {
  status: number;
  message: string;
  cause?: unknown;
  code?: string;
  errors?: ApiError[];
}

type KnownApiErrorParams = Omit<Partial<ApiErrorParams>, "status">;

export class ApiError extends Error {
  status: number;
  cause?: unknown;
  code: string;
  errors: ApiError[];

  constructor({ status, message, code, cause, errors }: ApiErrorParams) {
    super(message);
    this.status = status;
    this.cause = cause;
    this.code = code ?? "unknown";
    this.errors = errors ?? [];
    // Only capture stack traces in development
    if (process.env.NODE_ENV === "development") {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static badRequest(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Bad request";
    return new ApiError({
      status: 400,
      message: errorMessage,
      cause,
      code: "bad_request",
    });
  }

  static unauthorized(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Unauthorized";
    return new ApiError({
      status: 401,
      message: errorMessage,
      cause,
      code: "unauthorized",
    });
  }

  static forbidden(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Forbidden";
    return new ApiError({
      status: 403,
      message: errorMessage,
      cause,
      code: "forbidden",
    });
  }

  static notFound(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Not found";
    return new ApiError({
      status: 404,
      message: errorMessage,
      cause,
      code: "not_found",
    });
  }

  static methodNotAllowed(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Method not allowed";
    return new ApiError({
      status: 405,
      message: errorMessage,
      cause,
      code: "method_not_allowed",
    });
  }

  static conflict(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Conflict";
    return new ApiError({
      status: 409,
      message: errorMessage,
      cause,
      code: "conflict",
    });
  }

  static internalServerError(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Internal server error";
    return new ApiError({
      status: 500,
      message: errorMessage,
      cause,
      code: "internal_server_error",
    });
  }

  static badGateway(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Bad gateway";
    return new ApiError({
      status: 502,
      message: errorMessage,
      cause,
      code: "bad_gateway",
    });
  }

  static serviceUnavailable(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Service unavailable";
    return new ApiError({
      status: 503,
      message: errorMessage,
      cause,
    });
  }

  static gatewayTimeout(options?: KnownApiErrorParams) {
    const { message, cause } = options ?? {};
    const errorMessage = message ?? "Gateway timeout";
    return new ApiError({
      status: 504,
      message: errorMessage,
      cause,
    });
  }

  static fromError(error: unknown) {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      if (error instanceof z.ZodError) {
        // If the error is a ZodError, create a Bad Request error
        const errorMessage = error.message ?? "Invalid request parameters";
        const apiErrors = error.issues.map((issue) => {
          const { code, message } = issue;
          return new ApiError({
            status: 400,
            message: message ?? "Bad request",
            code,
          });
        });
        return ApiError.badRequest({
          message: errorMessage,
          errors: apiErrors,
          cause: error,
        });
      } else {
        // For other types of errors, create an Internal Server Error error
        return ApiError.internalServerError({
          cause: error,
        });
      }
    }

    // If the error is not an instance of Error, create an Internal Server Error error with a generic message
    return ApiError.internalServerError({ message: "Unknown error" });
  }
}

export function sendApiError({
  res,
  error,
  target,
}: {
  res: NextApiResponse;
  error: unknown;
  target?: URL;
}) {
  const apiError = ApiError.fromError(error);

  console.error("The following error occurred:", apiError);

  if (target) {
    target.searchParams.set("error", apiError.code);
    target.searchParams.set("error_description", apiError.message);
    target.searchParams.set("error_status", apiError.status.toString());
    target.searchParams.set(
      "error_count",
      (apiError.errors.length + 1).toString()
    );
    if (apiError.errors.length > 0) {
      target.searchParams.set(
        "errors",
        apiError.errors.map((e) => e.message).join(", ")
      );
    }
    res.writeHead(307, {
      Location: target.toString(),
    });
    res.end();
    return;
  }

  return res.status(apiError.status).json({
    error: {
      message: apiError.message,
      status: apiError.status,
      errors: apiError.errors,
      cause:
        process.env.NODE_ENV === "development" ? apiError.cause : undefined,
    },
  });
}
