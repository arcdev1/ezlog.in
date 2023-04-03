import { writeJwt } from "../lib/jwt";
import { env } from "~/env.mjs";
import { z } from "zod";
import { ApiError } from "~/lib/api-error";
import { createAddress } from "./address";

const PRIVATE_KEY = env.PRIVATE_KEY.replace(/\\n/g, "\n");

const addressJsonStringSchema = z.string().refine(
  (value) => {
    try {
      const parsedValue = JSON.parse(value) as Record<string, unknown>;
      createAddress(parsedValue);
      return true;
    } catch (error) {
      return false;
    }
  },
  {
    message: "Invalid address JSON string",
  }
);

const idTokenClaimsSchema = z.object({
  acr: z.string().nullish(),
  address: addressJsonStringSchema.nullish(),
  amr: z.array(z.string()).nullish(),
  at_hash: z.string().nullish(),
  aud: z.union([z.string().nonempty(), z.array(z.string().nonempty())]),
  auth_time: z.number().min(0).nullish(),
  azp: z.string().nullish(),
  birthdate: z.string().datetime().nullish(),
  c_hash: z.string().nullish(),
  created_at: z.number().min(0).nullish(),
  email: z.string().email().nullish(),
  email_verified: z.boolean().nullish(),
  exp: z.number().min(0),
  family_name: z.string().nullish(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).nullish(),
  given_name: z.string().nullish(),
  iat: z.number().min(0),
  iss: z.string().nonempty(),
  jti: z.string().nonempty().nullish(),
  locale: z.string().nullish(),
  middle_name: z.string().nullish(),
  name: z.string().nullish(),
  nbf: z.number().min(0).nullish(),
  nickname: z.string().nullish(),
  nonce: z.string().nullish(),
  phone_number: z.string().nullish(),
  phone_number_verified: z.boolean().nullish(),
  picture: z.string().url().nullish(),
  preferred_username: z.string().nullish(),
  profile: z.string().url().nullish(),
  s_hash: z.string().nullish(),
  sub: z.string().nonempty(),
  updated_at: z.number().min(0).nullish(),
  website: z.string().url().nullish(),
  zoneinfo: z.string().nullish(),
});

export type IdTokenClaims = z.infer<typeof idTokenClaimsSchema>;

export function createIdTokenClaims(
  claims: Record<string, unknown>
): IdTokenClaims {
  if (claims satisfies Record<string, unknown>) {
    return idTokenClaimsSchema.parse(claims);
  }
  throw ApiError.badRequest({ message: "Invalid ID token claims" });
}

const partialIdTokenClaimsSchema = idTokenClaimsSchema.partial();
export type PartialIdTokenClaims = z.infer<typeof partialIdTokenClaimsSchema>;

export function createPartialIdTokenClaims(
  claims: Record<string, unknown>
): PartialIdTokenClaims {
  if (claims satisfies Record<string, unknown>) {
    return partialIdTokenClaimsSchema.parse(claims);
  }
  throw ApiError.badRequest({ message: "Invalid ID token claims" });
}

const scopeToClaimsMapping = {
  openid: [
    "acr",
    "amr",
    "at_hash",
    "aud",
    "auth_time",
    "azp",
    "c_hash",
    "created_at",
    "exp",
    "iat",
    "iss",
    "jti",
    "name",
    "nonce",
    "nbf",
    "s_hash",
    "updated_at",
    "sub",
  ],
  profile: [
    "given_name",
    "family_name",
    "middle_name",
    "nickname",
    "preferred_username",
    "profile",
    "picture",
    "website",
  ],
  email: ["email", "email_verified"],
  address: ["address"],
  phone: ["phone_number", "phone_number_verified"],
};

const scopeToClaimsMap = new Map<string, string[]>(
  Object.entries(scopeToClaimsMapping)
);

function filterClaimsByScopes(
  claims: IdTokenClaims,
  scopes?: Array<string>
): PartialIdTokenClaims {
  if (!scopes) {
    return {};
  }

  const filteredClaims: PartialIdTokenClaims = {};

  for (const scope of scopes) {
    const claimKeys = scopeToClaimsMap.get(scope) as Array<keyof IdTokenClaims>;

    if (claimKeys) {
      for (const claimKey of claimKeys) {
        if (claims[claimKey] !== undefined) {
          Object.assign(filteredClaims, {
            [claimKey]: claims[claimKey],
          });
        }
      }
    }
  }

  return filteredClaims;
}

export function createIdToken({
  claims,
  scopes,
}: {
  claims: IdTokenClaims;
  scopes?: Array<string>;
}): string {
  const filteredClaims = filterClaimsByScopes(claims, scopes);
  return writeJwt(filteredClaims, PRIVATE_KEY);
}
