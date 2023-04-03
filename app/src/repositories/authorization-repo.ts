import { prisma } from "~/server/db";
import { type Authorization } from "@prisma/client";
import { type OidcAuthRequest } from "~/models/oidc-auth-request";
import { makeId, offsetCurrentDateTime } from "~/utils";
import { type PartialIdTokenClaims } from "~/models/id-token";
import { createAuthorization } from "~/models/authorization";

const AUTHORIZATION_EXPIRATION_MINUTES = 5;

export async function saveAuthorization(authorization: Authorization) {
  return prisma.authorization.upsert({
    where: {
      id: authorization.id,
    },
    update: authorization,
    create: authorization,
  });
}

export async function findAuthorizationByCode(code: string) {
  const dbAuth = await prisma.authorization.findUnique({
    where: {
      code,
    },
  });
  return dbAuth ? createAuthorization(dbAuth) : null;
}

interface CreateAuthFromRequestParams {
  authRequest: OidcAuthRequest;
  idToken: PartialIdTokenClaims & {
    sub: string;
  };
}

export async function createAuthorizationFromAuthRequest({
  authRequest,
  idToken,
}: CreateAuthFromRequestParams) {
  const data = {
    id: makeId(),
    user_id: idToken.sub,
    code: makeId(),
    client_id: authRequest.client_id,
    redirect_uri: authRequest.redirect_uri,
    scope: authRequest.scope,
    nonce: authRequest.nonce ?? null,
    state: authRequest.state ?? null,
    code_challenge: authRequest.code_challenge ?? null,
    code_challenge_method: authRequest.code_challenge_method ?? null,
    expires_at: offsetCurrentDateTime({
      minutes: AUTHORIZATION_EXPIRATION_MINUTES,
    }),
    created_at: new Date(),
  };
  return saveAuthorization(data);
}
