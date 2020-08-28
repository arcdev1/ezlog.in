import {
  makeHttpHandler,
  HttpRequestObject,
  HttpResponseObject,
  created,
  methodNotAllowed,
} from "../../../../infrastructure/http-handler";

import { tokenService, GenerateTokensParams } from "../../../../entities/token";

const { handler } = makeHttpHandler(handleTokenRequest);
export default handler;

function handleTokenRequest(
  request: HttpRequestObject
): Readonly<HttpResponseObject> {
  if (request.method === "POST") {
    return postToken(request);
  }
  return methodNotAllowed({ allow: "POST" });
}

function postToken(request: HttpRequestObject): Readonly<HttpResponseObject> {
  const tokens = tokenService.generateTokens(
    toTokenParams(request.body as TokenRequestBody)
  );
  if (tokens) {
    return created({
      headers: {
        "Content-Type": "application/json",
      },
      data: tokens,
    });
  }
}

function toTokenParams(requestBody: TokenRequestBody): GenerateTokensParams {
  let params = {
    clientId: requestBody.client_id,
  };
  switch (requestBody.grant_type) {
    case "authorization_code":
      let authCodeParams = {
        ...params,
        grant: requestBody.grant_type,
        code: requestBody.code,
        redirect: requestBody.redirect_uri,
      };
      return "code_verifier" in requestBody
        ? {
            ...authCodeParams,
            verifier: requestBody.code_verifier,
          }
        : {
            ...authCodeParams,
            secret: requestBody.client_secret,
          };
    case "client_credentials":
      return;
  }
}

interface AuthCodeFlowRequestBody {
  grant_type: "authorization_code";
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri?: string;
}

interface AuthCodeFlowPkceRequestBody {
  grant_type: "authorization_code";
  client_id: string;
  code_verifier: string;
  code: string;
  redirect_uri?: string;
}

interface ClientCredentialFlowRequestBody {
  grant_type: "client_credentials";
  client_id: string;
  client_secret: string;
  audience: string;
}

interface RefreshTokenFlowRequestBody {
  grant_type: "refresh_token";
  client_id: string;
  client_secret?: string;
  refresh_token: string;
  scope?: string;
}

type TokenRequestBody =
  | AuthCodeFlowRequestBody
  | AuthCodeFlowPkceRequestBody
  | ClientCredentialFlowRequestBody
  | RefreshTokenFlowRequestBody;
