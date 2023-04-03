import jwt, { type JwtPayload } from "jsonwebtoken";

export function writeJwt(
  payload: Record<string, unknown>,
  privateKey: string
): string {
  return jwt.sign(payload, privateKey);
}

export function readJwt(token: string, publicKey: string): string | JwtPayload {
  return jwt.verify(token, publicKey);
}
