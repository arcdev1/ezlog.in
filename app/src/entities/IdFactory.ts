import { ValueObject } from "./ValueObject";

export type IdProvider = () => string;

export interface Id extends ValueObject<string> {
  toString: () => string;
}

export class IdFactory {
  #idProvider: IdProvider;
  public constructor({ idProvider }: { idProvider: IdProvider }) {
    console.log(idProvider);
    this.#idProvider = idProvider;
  }

  public nextId(): Id {
    let idString = this.#idProvider();
    return this.idOf(idString);
  }

  public idOf(idString: string): Id {
    const invalidId = this.validate(idString);
    if (invalidId) {
      throw invalidId;
    }
    return IdImpl.of(idString);
  }

  public get ID_FORMAT() {
    return /(\w|\d|~|-){21,}/i;
  }

  public validate(id: string) {
    return this.ID_FORMAT.test(id)
      ? undefined
      : new InvalidIdError({ id, pattern: this.ID_FORMAT.source });
  }
}

class IdImpl extends ValueObject<string> {
  private constructor(id: string) {
    super(id);
  }

  public static of(id: string) {
    return new IdImpl(id);
  }

  public toString() {
    return this.value;
  }
}

export class InvalidIdError extends Error {
  params: { id: string; pattern: string };
  constructor(params: { id: string; pattern: string }) {
    super(
      `The supplied id, "${params.id}" is not valid. It must conform to regex: ${params.pattern}`
    );

    Error.captureStackTrace && Error.captureStackTrace(this, InvalidIdError);

    this.name = "InvalidIdError";
    this.params = params;
  }
}
