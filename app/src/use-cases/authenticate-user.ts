import bcrypt from "bcrypt";
import { prisma } from "~/server/db";
import { type User } from "@prisma/client";
import { env } from "~/env.mjs";
import { toUnixTime } from "~/utils";
import { ApiError } from "~/lib/api-error";
import { ApiResult } from "~/lib/api-result";
import {
  type EmailAndPasswordCredential,
  type UserCredential,
} from "~/models/user-credential";
import { writeJwt } from "~/lib/jwt";

const PRIVATE_KEY = env.PRIVATE_KEY.replace(/\\n/g, "\n");

export interface AuthResponseBody {
  [key: string]: string;
}

export async function authenticateUser(
  credential: UserCredential
): Promise<ApiResult<AuthResponseBody>> {
  if (credential satisfies EmailAndPasswordCredential) {
    return authenticateViaEmailAndPassword(credential);
  }
  throw ApiError.badRequest({
    message: "Invalid credential",
  });
}

async function authenticateViaEmailAndPassword(
  credential: EmailAndPasswordCredential
): Promise<ApiResult<AuthResponseBody>> {
  const { email, password, client_id } = credential;

  // Validate the email and password
  if (!email || !password) {
    throw ApiError.badRequest({
      message: "Email and password are required",
    });
  }

  // Find the user with the given email address
  const user: User | null = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.badRequest({
      message: "Invalid email or password",
    });
  }

  // Compare the password hash with the provided password
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    throw ApiError.badRequest({
      message: "Invalid email or password",
    });
  }

  // Generate a JWT token containing the user ID and email
  const token = writeJwt(
    {
      sub: user.id,
      auth_time: toUnixTime(Date.now()),
      aud: client_id,
      alg: "RS256",
      iss: "https://ezlog.in",
      exp: toUnixTime(Date.now() + 600000),
    },
    PRIVATE_KEY
  );

  return ApiResult.withCookie({
    data: { message: "Login successful" },
    key: env.SESSION_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: env.NODE_ENV != "development",
      sameSite: "Lax",
      domain: env.VERCEL_URL,
    },
  });
}
