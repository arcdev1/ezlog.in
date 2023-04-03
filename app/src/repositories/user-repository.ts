import {
  type User as DbUser,
  type Address as DbAddress,
  type Client as DbClient,
} from "@prisma/client";
import { type Address, createAddress } from "~/models/address";
import {
  createUser,
  type UserRegistration,
  type User,
  type UserBase,
} from "~/models/user";
import { prisma } from "~/server/db";
import { nullIfUndefined, replaceNullWithUndefined, toUnixTime } from "~/utils";

type FindUserInclude = Array<"clients" | "address">;
export async function findUser({
  id,
  include,
}: {
  id: string;
  include?: FindUserInclude;
}) {
  const includeData = {} as Record<FindUserInclude[number], boolean>;

  if (include) {
    include.forEach((i) => {
      includeData[i] = true;
    });
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id,
    },
    include: includeData,
  });

  return dbUser ? toUserModel(dbUser) : null;
}

export async function findUserByEmail({
  email,
  include,
}: {
  email: string;
  include?: FindUserInclude;
}) {
  const includeData = {} as Record<FindUserInclude[number], boolean>;

  if (include) {
    include.forEach((i) => {
      includeData[i] = true;
    });
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email,
    },
    include: includeData,
  });

  return dbUser ? toUserModel(dbUser) : null;
}

export async function saveUser(user: User) {
  const dbUser = toUserPersistence(user);
  const { address, clients, ...userDetails } = dbUser;
  const data: DbUser & Record<string, unknown> = userDetails;
  if (address) {
    data.address = {
      upsert: {
        create: address,
        update: address,
        where: {
          address_id: address.id,
        },
      },
    };
    if (clients) {
      data.clients = {
        connect: clients.map((c) => ({ id: c.id })),
      };
    }
  }

  const updatedDbUser = await prisma.user.upsert({
    where: {
      id: user.id,
    },
    create: data,
    update: data,
  });

  return toUserModel(updatedDbUser);
}

function toUserModel(
  dbUser: DbUser & { address?: DbAddress | null; clients?: DbClient[] | null }
): Readonly<User | UserBase | UserRegistration> {
  const dbUserNoNulls = replaceNullWithUndefined(dbUser);
  const user: User = {
    ...dbUserNoNulls,
    address: dbUserNoNulls.address
      ? toAddressModel(dbUserNoNulls.address)
      : null,
    clients: dbUserNoNulls.clients,
    created_at: toUnixTime(dbUserNoNulls.created_at),
    email_verified: dbUserNoNulls.email === dbUser.verified_email,
    auth_time: dbUserNoNulls.auth_time
      ? new Date(dbUserNoNulls.auth_time).toISOString()
      : undefined,
    phone_number_verified:
      dbUserNoNulls.phone_number === dbUser.verified_phone_number,
    updated_at: dbUserNoNulls.updated_at?.getTime()
      ? toUnixTime(dbUserNoNulls.updated_at)
      : undefined,
    website: dbUserNoNulls.website,
    zoneinfo: dbUserNoNulls.zoneinfo,
  };

  return createUser(user);
}

function toAddressModel(dbAddress: DbAddress): Readonly<Address> {
  const dbAddressNoNulls = replaceNullWithUndefined(dbAddress);
  const address: Address = {
    ...dbAddressNoNulls,
    formatted: `${dbAddressNoNulls.street_address ?? ""}\n${
      dbAddressNoNulls.locality ?? ""
    }, ${dbAddressNoNulls.region ?? ""}\n${dbAddressNoNulls.country ?? ""}\n${
      dbAddressNoNulls.postal_code ?? ""
    }`
      .replace(/\s+/g, " ")
      .trim(),
  };

  return createAddress(address);
}

export function toAddressPersistence(address: Address): DbAddress {
  const dbAddress: DbAddress = {
    id: address.id,
    country: address.country,
    locality: nullIfUndefined(address.locality),
    postal_code: nullIfUndefined(address.postal_code),
    region: nullIfUndefined(address.region),
    street_address: nullIfUndefined(address.street_address),
    user_id: address.user_id,
  };

  return dbAddress;
}

export function toUserPersistence(
  user: User
): DbUser & { address?: DbAddress | null; clients?: DbClient[] | null } {
  return {
    id: user.id,
    auth_time: user.auth_time ? new Date(user.auth_time) : null,
    address: user.address ? toAddressPersistence(user.address) : null,
    birthdate: nullIfUndefined(user.birthdate),
    created_at: new Date(user.created_at),
    // clients: user.clients),
    email: user.email,
    family_name: nullIfUndefined(user.family_name),
    gender: nullIfUndefined(user.gender),
    given_name: nullIfUndefined(user.given_name),
    language: nullIfUndefined(user.language),
    locale: nullIfUndefined(user.locale),
    middle_name: nullIfUndefined(user.middle_name),
    name: nullIfUndefined(user.name),
    nickname: nullIfUndefined(user.nickname),
    password: user.password,
    phone_number: nullIfUndefined(user.phone_number),
    picture: nullIfUndefined(user.picture),
    preferred_username: nullIfUndefined(user.preferred_username),
    profile: nullIfUndefined(user.profile),
    updated_at: user.updated_at ? new Date(user.updated_at) : null,
    website: nullIfUndefined(user.website),
    zoneinfo: nullIfUndefined(user.zoneinfo),
    verified_email: user.email_verified ? user.email : null,
    verified_phone_number: user.phone_number_verified
      ? nullIfUndefined(user.phone_number)
      : null,
  };
}
