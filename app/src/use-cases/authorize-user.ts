import {
  type PartialIdTokenClaims,
  createPartialIdTokenClaims,
} from "~/models/id-token";
import { type OidcAuthRequest } from "~/models/oidc-auth-request";
import { env } from "~/env.mjs";
import { ApiResult } from "~/lib/api-result";
import { offsetCurrentDateTime, toUnixTime } from "~/utils";
import { createAuthorizationFromAuthRequest } from "~/repositories/authorization-repo";
import { findUser } from "~/repositories/user-repository";
import { readJwt } from "~/lib/jwt";
import { type Authorization } from "~/models/authorization";

const PUBLIC_KEY = env.PUBLIC_KEY.replace(/\\n/g, "\n");
const LOGIN_EXPIRATION_OFFSET_SECONDS = -5;

interface AuthorizeUserParams {
  token?: string;
  authRequest: OidcAuthRequest;
}

type AuthorizeUserResult = Promise<ApiResult>;

/**
 * Authorize a user by verifying their token, ensuring their user account exists,
 * and generating a new authorization entry for the requested client.
 *
 * @export
 * @param {AuthorizeUserParams} {
 *   token: The user's JWT token.
 *   authRequest: An OpenID Connect authentication request containing required information.
 * }
 * @returns {AuthorizeUserResult} An API result with a temporary redirect to the appropriate URL.
 */
export async function authorizeUser({
  token,
  authRequest,
}: AuthorizeUserParams): AuthorizeUserResult {
  const loginUrl = computeLoginUrl({ authRequest });
  const loginRedirect = ApiResult.temporaryRedirect({ location: loginUrl });

  if (token == null || token.length === 0) {
    return loginRedirect;
  }

  const claims = readJwt(token, PUBLIC_KEY);

  const idToken = createPartialIdTokenClaims(claims as Record<string, unknown>);
  if (!idToken.sub || !idToken.aud) {
    return loginRedirect;
  }

  const user = await findUser({
    id: idToken.sub,
    include: ["clients"],
  });

  if (user == null) {
    return loginRedirect;
  }

  if (!user.clients?.some((client) => client.id === authRequest.client_id)) {
    // redirect to a page that asks the user to authorize the client
  }

  if (authRequest.max_age != null) {
    const loginExpired =
      idToken.auth_time == null ||
      idToken.auth_time + authRequest.max_age <
        toUnixTime(
          offsetCurrentDateTime({ seconds: LOGIN_EXPIRATION_OFFSET_SECONDS })
        );

    if (loginExpired) {
      return loginRedirect;
    }
  }

  const authorization = await createAuthorizationFromAuthRequest({
    authRequest,
    idToken: idToken as PartialIdTokenClaims & { sub: string; aud: string },
  });

  const redirectUrl = computeRedirectUrl({ authorization });
  return ApiResult.temporaryRedirect({ location: redirectUrl });
}

function computeLoginUrl({ authRequest }: { authRequest: OidcAuthRequest }) {
  const scheme = env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${scheme}://${env.VERCEL_URL.replace(/https?:\/\//, "")}`;
  const loginUrl = new URL("/login", baseUrl);
  for (const key in authRequest) {
    const value = authRequest[key as keyof OidcAuthRequest];
    if (value != null) {
      loginUrl.searchParams.append(key, value.toString());
    }
  }
  return loginUrl;
}

function computeRedirectUrl({
  authorization,
}: {
  authorization: Authorization;
}) {
  const url = new URL(authorization.redirect_uri);
  url.searchParams.append("code", authorization.code);
  if (authorization.state) {
    url.searchParams.append("state", authorization.state);
  }
  return url;
}
