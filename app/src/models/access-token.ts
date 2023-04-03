import { env } from "~/env.mjs";
import { writeJwt } from "../lib/jwt";
import { z } from "zod";

const accessTokenClaimsSchema = z.object({
  aud: z.union([z.string(), z.array(z.string())]),
  exp: z.number(),
  iat: z.number().nullish(),
  iss: z.string(),
  jti: z.string().nullish(),
  nbf: z.number().nullish(),
  scope: z.string().nullish(),
  sub: z.string(),
});

export type AccessTokenClaims = z.infer<typeof accessTokenClaimsSchema>;

export function accessTokenClaims(params: unknown): AccessTokenClaims {
  return accessTokenClaimsSchema.parse(params);
}

const PRIVATE_KEY = env.PRIVATE_KEY.replace(/\\n/g, "\n");

export function createAccessToken(claims: AccessTokenClaims): string {
  return writeJwt(claims, PRIVATE_KEY);
}
