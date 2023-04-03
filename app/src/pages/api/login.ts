import { type NextApiRequest, type NextApiResponse } from "next";
import { ApiError, sendApiError } from "~/lib/api-error";
import { sendApiResult } from "~/lib/api-result";
import { authenticateUser } from "~/use-cases/authenticate-user";
import { createUserCredential } from "~/models/user-credential";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const credential = createUserCredential(req.body);
      const apiResult = await authenticateUser(credential);
      sendApiResult({ res, apiResult });
    } else {
      throw ApiError.methodNotAllowed();
    }
  } catch (error) {
    const apiError = ApiError.fromError(error);
    sendApiError({ res, error: apiError });
  }
}
