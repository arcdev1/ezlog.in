import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().uuid(),
  formatted: z.string().nullish(),
  street_address: z.string().nullish(),
  locality: z.string().nullish(),
  region: z.string().nullish(),
  postal_code: z.string().nullish(),
  country: z.string(),
  user_id: z.string().uuid(),
});

export type Address = z.infer<typeof addressSchema>;

export function createAddress(params: unknown): Readonly<Address> {
  const validAddress = addressSchema.parse(params);
  return validAddress as Readonly<Address>;
}
