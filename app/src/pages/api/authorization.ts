import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { sendApiResult } from "~/lib/api-result";
import { ApiError, sendApiError } from "~/lib/api-error";
import {
  oidcAuthRequest,
  extractRedirectUri,
} from "~/models/oidc-auth-request";
import { URL } from "url";
import { authorizeUser } from "~/use-cases/authorize-user";

const SESSION_KEY = env.SESSION_COOKIE_NAME;

const authorization = async (req: NextApiRequest, res: NextApiResponse) => {
  let responseTarget: URL;

  try {
    const params = (req.method === "GET" ? req.query : req.body) as Record<
      string,
      unknown
    >;
    responseTarget = new URL(extractRedirectUri(params));
  } catch (error) {
    console.error("Error during authorization:", error);
    const apiError = ApiError.fromError(error);
    return sendApiError({ res, error: apiError });
  }

  try {
    if (req.method !== "POST" && req.method !== "GET") {
      throw ApiError.methodNotAllowed();
    }

    const token = req.cookies[SESSION_KEY];
    const authRequest = oidcAuthRequest(
      req.method === "GET" ? req.query : req.body
    );
    const apiResult = await authorizeUser({ token, authRequest });
    return sendApiResult({ res, apiResult });
  } catch (error) {
    return sendApiError({ res, error, target: responseTarget });
  }
};

export default authorization;
