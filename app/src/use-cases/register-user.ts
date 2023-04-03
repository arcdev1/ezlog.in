import { toBaseUser, type UserRegistration } from "~/models/user";
import { findUserByEmail, saveUser } from "~/repositories/user-repository";
import { ApiError } from "~/lib/api-error";
import bcrypt from "bcrypt";
import { type User } from "~/models/user";
import { makeId, toUnixTime } from "~/utils";
import { ApiResult } from "~/lib/api-result";

export async function registerUser(registration: UserRegistration) {
  // Check if the email is already in use
  const { email, password, client_id } = registration;

  const existingUser = await findUserByEmail({ email });
  if (existingUser) {
    throw ApiError.conflict({ message: "Email already in use" });
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: makeId(),
    email,
    password: hashedPassword,
    clients: [], // TODO: connect to client
    created_at: toUnixTime(new Date()),
  };

  const saved = await saveUser(newUser);

  return ApiResult.created(toBaseUser(saved as User));
}
