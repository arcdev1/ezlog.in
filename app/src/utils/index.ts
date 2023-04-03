import crypto from "crypto";

interface Offset {
  minutes?: number;
  seconds?: number;
}

export function offsetCurrentDateTime(offset: Offset): Date {
  const future = new Date();

  if (offset.minutes) {
    future.setMinutes(future.getMinutes() + offset.minutes);
  }

  if (offset.seconds) {
    future.setSeconds(future.getSeconds() + offset.seconds);
  }

  return future;
}

/**
 * Generates a random UUID using the crypto module.
 *
 * @returns {string} A random UUID
 */
export function makeId(): string {
  // use crypto to generate a uuid
  return crypto.randomUUID();
}

/**
 * Determines whether a given string is a valid URL.
 *
 * @param {string} url - The string to check
 * @returns {boolean} true if the string is a valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Convert a date or number of milliseconds to Unix time (seconds since the Unix epoch).
 * @param input - A date object or number of milliseconds since the Unix epoch.
 * @returns The number of seconds since the Unix epoch.
 */
export function toUnixTime(input: Date | number): number {
  const date = typeof input === "number" ? new Date(input) : input;
  return Math.floor(date.getTime() / 1000);
}

/**
 * Convert a Unix timestamp (seconds since the Unix epoch) to a JavaScript Date object.
 * @param seconds - The number of seconds since the Unix epoch.
 * @returns A JavaScript Date object representing the specified Unix time.
 */
export function fromUnixTime(seconds: number): Date {
  return new Date(seconds * 1000);
}

export function snakeToCamel(str: string): string {
  return str
    .replace(/(^_+)|(_+$)/g, "") // Remove leading and trailing underscores
    .replace(/_+/g, "_") // Replace multiple consecutive underscores with a single one
    .replace(/_([a-zA-Z])/g, (_, letter) => (letter as string).toUpperCase());
}

/**
 * Converts a string from camelCase to snake_case.
 * @param {string} str - The input string in camelCase.
 * @returns {string} The converted string in snake_case.
 */
export function camelToSnake(str: string): string {
  return str
    .replace(/^[A-Z]/, (match) => match.toLowerCase()) // Lowercase the first character if uppercase
    .replace(/(?<=[a-z])[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

/**
 * Recursively converts all snake_case keys in an object to camelCase.
 * @param {object} obj - The input object.
 * @returns {object} The object with all keys converted to camelCase.
 */
export function snakeToCamelObj<
  R extends Record<string | number, unknown>,
  T extends Record<string | number, unknown>
>(obj: T): R {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelObj) as Record<number, unknown> as R;
  }

  return Object.keys(obj).reduce((result, key) => {
    const camelKey = snakeToCamel(key) as keyof typeof result;
    const value = obj[key];

    if (typeof value === "object" && value !== null) {
      result[camelKey] = snakeToCamelObj(
        value as Record<string, unknown>
      ) as (typeof result)[keyof typeof result];
    } else {
      result[camelKey] = value as (typeof result)[keyof typeof result];
    }

    return result;
  }, {} as R);
}

/**
 * Recursively converts all camelCase keys in an object to snake_case.
 * @param {object} obj - The input object.
 * @returns {object} The object with all keys converted to snake_case.
 */
export function camelToSnakeObj(obj: Record<string, unknown>): object {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnakeObj);
  }

  return Object.keys(obj).reduce((result, key) => {
    const snakeKey = camelToSnake(key);
    const value = obj[key];

    if (typeof value === "object" && value !== null) {
      result[snakeKey] = camelToSnakeObj(value as Record<string, unknown>);
    } else {
      result[snakeKey] = value;
    }

    return result;
  }, {} as Record<string, unknown>);
}

/**
 * Converts a type `T` to `undefined` if it is `null`, otherwise retains the original type.
 *
 * @template T - The input type to be checked for `null`.
 */
export type IfNullThenUndefined<T> = T extends null ? undefined : T;

/**
 * Recursively converts all properties of type `T` with `null` values to `undefined`.
 *
 * @template T - The input object type with potentially nested `null` values.
 */
export type NullPropsToUndefined<T> = {
  [P in keyof T]: IfNullThenUndefined<T[P]>;
};

/**
 * Recursively replaces all `null` values in the given object with `undefined`.
 *
 * @template T - A type extending `Record<string, unknown>`.
 * @param {T} obj - The input object with potentially nested `null` values.
 * @returns {NullPropsToUndefined<T>} - A new object with all `null` values replaced by `undefined`.
 */
export function replaceNullWithUndefined<T extends Record<string, unknown>>(
  obj: T
): NullPropsToUndefined<T> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    const resultKey = key as keyof T;

    if (value === null) {
      result[resultKey] = undefined as IfNullThenUndefined<T[keyof T]>;
    } else if (typeof value === "object" && value !== null) {
      result[resultKey] = replaceNullWithUndefined(
        value as Record<string, unknown>
      ) as IfNullThenUndefined<T[keyof T]>;
    } else {
      result[resultKey] = value as IfNullThenUndefined<T[keyof T]>;
    }

    return result;
  }, {} as NullPropsToUndefined<T>);
}

export function nullIfUndefined<T>(value: T | undefined): T | null {
  return value ?? null;
}

export function hashS256(value: string): string {
  const hasher = crypto.createHash("sha256");
  hasher.update(value);
  return hasher.digest().toString("base64");
}

export function hashS256UrlSafe(value: string): string {
  return hashS256(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function base64urlDecode(base64Url: string): string {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = 4 - (base64.length % 4);
  const padding = paddingLength === 4 ? "" : Array(paddingLength + 1).join("=");
  const base64Padded = base64 + padding;
  return Buffer.from(base64Padded, "base64").toString("utf-8");
}
