import { type Authorization as DbAuthorization } from "@prisma/client";

export type Authorization = DbAuthorization;

export function createAuthorization(params: unknown): Authorization {
  if (!(params as Authorization satisfies Authorization))
    throw new Error("Invalid authorization");
  return params as Authorization;
}
