import { makeRandomUrlSafeString } from "./";

export function makeId() {
  return makeRandomUrlSafeString(21);
}

export function validateId(id: string): InvalidIdError | void {
  const pattern = /(\w|\d|~|-){21,}/gi;
  if (!pattern.test(id)) {
    return new InvalidIdError({ id, pattern: pattern.source });
  }
}

export class InvalidIdError extends Error {
  params: { id: string; pattern: string };
  constructor(params: { id: string; pattern: string }) {
    super("Id is not valid.");

    Error.captureStackTrace && Error.captureStackTrace(this, InvalidIdError);

    this.name = "MissingIdError";
    this.params = params;
  }
}
