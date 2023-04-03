import { type NextApiRequest, type NextApiResponse } from "next";
import { type UserRegistration, createUser } from "~/models/user";
import { ApiError, sendApiError } from "~/lib/api-error";
import { sendApiResult } from "~/lib/api-result";
import { registerUser } from "~/use-cases/register-user";

export default async function users(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      return handlePost(req, res);
    } else {
      throw ApiError.methodNotAllowed();
    }
  } catch (error) {
    return sendApiError({ res, error });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const registration = createUser(req.body) as UserRegistration;

  if (!(registration satisfies UserRegistration)) {
    throw ApiError.badRequest({
      message: "Invalid registration data",
    });
  }

  const registered = await registerUser(registration);
  sendApiResult({ res, apiResult: registered });
}
