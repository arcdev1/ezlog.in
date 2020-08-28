import { makeTokenService, GenerateTokensParams } from "./token-service";
import { makeId, makeJwt } from "@devmastery/utils";
const tokenService = makeTokenService({
  makeJwt,
  makeId,
  issuer: "https://ezlog.in",
  jwk: JSON.parse(process.env.jwks).filter(
    (jwk) => !jwk.kid.toLowerCasse().startsWith("test")
  )[0],
});

export { tokenService };
export type { GenerateTokensParams };
