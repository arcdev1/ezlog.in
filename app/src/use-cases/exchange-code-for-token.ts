import crypto from "crypto";

import jwks from "../../public/.well-known/jwks.json";
import { ApiError } from "~/lib/api-error";
import { findAuthorizationByCode } from "~/repositories/authorization-repo";
import { findUser } from "~/repositories/user-repository";
import { hashS256UrlSafe, offsetCurrentDateTime, toUnixTime } from "~/utils";
import { createIdToken, createIdTokenClaims } from "~/models/id-token";
import { createAccessToken } from "~/models/access-token";
import { toUserClaims } from "~/models/user";
import { ApiResult } from "~/lib/api-result";
import { type Authorization } from "~/models/authorization";

const jwk = jwks.keys[0];

export interface CodeForTokenParams {
  code: string;
  state?: string;
  codeVerifier?: string;
}

export async function exchangeCodeForToken(props: CodeForTokenParams) {
  const auth = await getAuthorization(props);
  const user = await getUserByAuthorization(auth);

  const accessTokenClaims = {
    aud: auth.client_id,
    exp: toUnixTime(offsetCurrentDateTime({ minutes: 20 })),
    iat: toUnixTime(Date.now()),
    iss: "https://ezlog.in",
    jti: jwk?.kid,
    nbf: toUnixTime(Date.now()),
    scope: auth.scope,
    sub: user.id,
  };

  const accessToken = createAccessToken(accessTokenClaims);

  const scopes = auth.scope.split(" ");

  const userClaims = toUserClaims(user);

  const idTokenClaims = createIdTokenClaims({
    at_hash: crypto
      .createHash("sha1")
      .update(accessToken)
      .digest()
      .toString("base64"),
    aud: auth.client_id,
    c_hash: "todo",
    created_at: user.created_at,
    exp: toUnixTime(offsetCurrentDateTime({ minutes: 20 })),
    iat: toUnixTime(Date.now()),
    iss: "https://ezlog.in",
    nonce: auth.nonce ?? undefined,
    s_hash: "todo",
    sub: user?.id,
  });

  const idToken = createIdToken({
    claims: { ...idTokenClaims, ...userClaims },
    scopes,
  });

  return ApiResult.ok({
    access_token: accessToken,
    id_token: idToken,
  });
}

async function getAuthorization(props: CodeForTokenParams) {
  const auth = await findAuthorizationByCode(props.code);

  if (!auth) {
    throw ApiError.badRequest({ message: "Invalid authorization code" });
  }

  if (auth.expires_at.getTime() < Date.now()) {
    throw ApiError.badRequest({ message: "Authorization code has expired" });
  }

  if (auth.state != null && auth.state !== props.state) {
    throw ApiError.badRequest({ message: "Invalid state" });
  }

  if (auth.code_challenge != null) {
    if (props.codeVerifier == null) {
      throw ApiError.badRequest({ message: "Invalid code verifier" });
    }
    if (auth.code_challenge_method == null) {
      throw ApiError.badRequest({ message: "Invalid code challenge method" });
    }

    if (
      !validateCodeChallenge({
        code_challenge: auth.code_challenge,
        code_verifier: props.codeVerifier,
        method: auth.code_challenge_method,
      })
    ) {
      throw ApiError.badRequest({ message: "Code challenge failed" });
    }
  }

  return auth;
}

interface CodeChallenge {
  code_verifier: string;
  code_challenge: string;
  method: "S256" | "plain";
}

function validateCodeChallenge(challenge: CodeChallenge): boolean {
  const { code_verifier, code_challenge, method } = challenge;
  let isValid: boolean;

  if (method === "S256") {
    const code_challenge_computed = hashS256UrlSafe(code_verifier);
    isValid = code_challenge === code_challenge_computed;
  } else if (method === "plain") {
    isValid = code_verifier === code_challenge;
  } else {
    return false; // Invalid method
  }

  return isValid;
}

async function getUserByAuthorization(auth: Authorization) {
  const user = await findUser({ id: auth.user_id, include: ["clients"] });

  if (!user) {
    throw ApiError.badRequest({ message: "User may have been deleted." });
  }

  if (!user.clients?.some((client) => client.id === auth.client_id)) {
    throw ApiError.badRequest({
      message:
        "User is not authorized for this client. They may have withdrawn consent.",
    });
  }

  return user;
}
