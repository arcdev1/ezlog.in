export interface AuthCodeFlowParams {
  grant: "authorization_code";
  clientId: string;
  secret: string;
  code: string;
  redirect?: string;
}

export interface AuthCodeFlowPkceParams {
  grant: "authorization_code";
  clientId: string;
  verifier: string;
  code: string;
  redirect?: string;
}

export interface ClientCredentialFlowParams {
  grant: "client_credentials";
  clientId: string;
  secret: string;
  audience: string;
}

export interface RefreshTokenFlowParams {
  grant: "refresh_token";
  clientId: string;
  secret?: string;
  refresh: string;
  scope?: string;
}

export type GenerateTokensParams =
  | AuthCodeFlowParams
  | AuthCodeFlowPkceParams
  | ClientCredentialFlowParams
  | RefreshTokenFlowParams;

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

interface MakeJwtOptions {
  audience: string | string[];
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: string | number;
  issuer: string;
  jwk: JwkForJwt;
  jwtId?: string;
  payload: object;
  subject: string;
}

export function makeTokenService({
  makeJwt,
  jwk,
  issuer,
  makeId,
}: {
  makeJwt: (options: MakeJwtOptions) => string;
  jwk: JwkForJwt;
  issuer: string;
  makeId: () => string;
}) {
  return Object.freeze({
    generateTokens,
  });

  function generateTokens(params: GenerateTokensParams) {
    if ("verifier" in params) {
      return generatePkceTokens(params);
    }
    switch (params.grant) {
      case "authorization_code":
        return generateAuthTokens(params);
      case "client_credentials":
        return generateClientTokens(params);
      case "refresh_token":
        return refreshTokens(params);
      default:
        throw new Error("Unrecognized grant type.");
    }
  }

  function generateAuthTokens(params: AuthCodeFlowParams) {
    let audience = params.clientId;
    let subject = params.clientId;
    let accessPayload = {
      test: "test",
    };
    let idPayload = {
      name: "Joe Blow",
      email: "joe.blow@me.com",
    };
    return {
      access_token: makeJwt({
        jwk,
        audience,
        issuer,
        expiresIn: "30min",
        jwtId: makeId(),
        payload: accessPayload,
        subject,
      }),
      id_token: makeJwt({
        jwk,
        audience,
        issuer,
        expiresIn: "30min",
        jwtId: makeId(),
        payload: idPayload,
        subject,
      }),
      refresh_token: makeJwt({
        jwk,
        audience,
        issuer,
        expiresIn: "40min",
        jwtId: makeId(),
        payload: { refresh: makeId() },
        subject,
      }),
    };
  }
  function generateClientTokens(params: ClientCredentialFlowParams) {}
  function generatePkceTokens(params: AuthCodeFlowPkceParams) {}
  function refreshTokens(params: RefreshTokenFlowParams) {}
}
