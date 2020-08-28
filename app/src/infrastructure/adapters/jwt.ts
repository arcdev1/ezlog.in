import * as jwt from "jsonwebtoken";
import jwk2pem from "jwk-to-pem";
import { makeId } from "@devmastery/utils";

export interface JwkForJwtPublic {
  alg: "RS512";
  e: string;
  kid: string;
  kty: "RSA";
  n: string;
  use: "sig";
}

export interface JwkForJwt extends JwkForJwtPublic {
  d: string;
  dp: string;
  dq: string;
  p: string;
  q: string;
  qi: string;
}

interface makeJwtOptions {
  audience: string | string[];
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: string | number;
  issuer: string;
  jwk: JwkForJwt;
  jwtId?: string;
  payload: object;
  subject: string;
}

export function makeJwt({
  audience,
  expiresIn,
  issuer,
  jwk,
  jwtId,
  payload,
  subject,
}: makeJwtOptions) {
  const pem = jwk2pem(jwk, { private: true });
  const options: jwt.SignOptions = {
    algorithm: jwk.alg,
    audience,
    expiresIn,
    issuer,
    jwtid: jwtId || makeId(),
    keyid: jwk.kid,
    subject: subject,
  };
  return jwt.sign(payload, pem, options);
}

export function verifyJwt({
  token,
  jwk,
  audience,
  issuer,
  subject,
}: {
  token: string;
  jwk: JwkForJwtPublic;
  audience: string;
  issuer: string;
  subject: string;
}) {
  let pem = jwk2pem(jwk);
  return jwt.verify(token, pem, { audience, issuer, subject });
}
