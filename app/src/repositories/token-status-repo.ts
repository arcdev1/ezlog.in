import { type TokenStatus } from "@prisma/client";
import { prisma } from "~/server/db";

export function findTokenStatusByHash(
  tokenHash: string
): Promise<TokenStatus | null> {
  return prisma.tokenStatus.findUnique({
    where: {
      token_hash: tokenHash,
    },
  });
}

export function addTokenStatus(tokenStatus: TokenStatus): Promise<TokenStatus> {
  return prisma.tokenStatus.create({
    data: tokenStatus,
  });
}
