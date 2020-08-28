import * as nanoid from "nanoid";

export function makeRandomUrlSafeString(len?: number) {
  return nanoid.nanoid(len);
}
