import z from "Zod";
import { clientSchema } from "./client";
import { addressSchema } from "./address";

const userBaseSchema = z.object({
  id: z.string().uuid(),
  birthdate: z.string().nullish(),
  created_at: z.number().min(0),
  email: z.string().email(),
  email_verified: z.boolean().nullish(),
  family_name: z.string().nullish(),
  gender: z.string().nullish(),
  given_name: z.string().nullish(),
  language: z.string().nullish(),
  auth_time: z.string().datetime().nullish(),
  locale: z.string().nullish(),
  middle_name: z.string().nullish(),
  name: z.string().nullish(),
  nickname: z.string().nullish(),
  phone_number: z.string().nullish(),
  phone_number_verified: z.boolean().nullish(),
  picture: z.string().nullish(),
  preferred_username: z.string().nullish(),
  profile: z.string().nullish(),
  updated_at: z.number().min(0).nullish(),
  website: z.string().nullish(),
  zoneinfo: z.string().nullish(),
});

export type UserBase = z.infer<typeof userBaseSchema>;

const userSchema = userBaseSchema.extend({
  address: addressSchema.nullish(),
  clients: z.array(clientSchema).nullish(),
  password: z.string().min(8),
});

export type User = z.infer<typeof userSchema>;

const userRegistrationSchema = userSchema
  .pick({ email: true, password: true })
  .extend({
    client_id: z.string().min(1),
  });

export type UserRegistration = z.infer<typeof userRegistrationSchema>;

export function createUser(
  params: unknown
): Readonly<User | UserBase | UserRegistration> {
  if (params as UserRegistration satisfies UserRegistration) {
    return userRegistrationSchema.parse(params) as Readonly<UserRegistration>;
  } else if (params as UserBase satisfies UserBase) {
    return userBaseSchema.parse(params) as Readonly<UserBase>;
  } else {
    return userSchema.parse(params) as Readonly<User>;
  }
}

export function toBaseUser(user: User): UserBase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, clients, address, ...userBase } = user;
  return userBase;
}

export function toUserClaims(user: User) {
  return {
    sub: user.id,
    email: user.email,
    email_verified: user.email_verified,
    family_name: user.family_name,
    given_name: user.given_name,
    locale: user.locale,
    name: user.name,
    picture: user.picture,
    preferred_username: user.preferred_username,
    profile: user.profile,
    website: user.website,
    zoneinfo: user.zoneinfo,
  };
}
