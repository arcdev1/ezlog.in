import * as z from "zod";

const userCredentialBaseSchema = z.object({ client_id: z.string().nullish() });

const emailAndPasswordSchema = userCredentialBaseSchema.extend({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userCredentialSchema = emailAndPasswordSchema;

export type UserCredential = z.infer<typeof userCredentialSchema>;
export type EmailAndPasswordCredential = z.infer<typeof emailAndPasswordSchema>;

export function createEmailAndPasswordCredential(
  params: unknown
): EmailAndPasswordCredential {
  return emailAndPasswordSchema.parse(params);
}

export function createUserCredential(params: unknown): UserCredential {
  if (params as UserCredential satisfies EmailAndPasswordCredential) {
    return createEmailAndPasswordCredential(params);
  }
  throw new Error("Invalid user credential");
}
