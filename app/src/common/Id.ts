import { errorIf } from "../errors/";
import { CustomError } from "../errors/CustomError";
import { isNotFormatted, isNullOrEmpty } from "./utils/assertions";
import { ValueObject } from "./ValueObject";

export type PrimitiveIdFn = () => string | Promise<string>;
export interface IdProvider {
  next: () => Id | Promise<Id>;
}
export class IdProviderImpl {
  readonly #primitiveId: PrimitiveIdFn;

  constructor({ primitiveId }: { primitiveId: PrimitiveIdFn }) {
    this.#primitiveId = primitiveId;
  }

  public async next() {
    return Id.of(await this.#primitiveId());
  }
}

export class Id extends ValueObject<string> {
  public static of(value: string) {
    Id.validate(value, { throwOnError: true });
    return new Id(value);
  }

  public static validate(value: string, options?: { throwOnError: boolean }) {
    let error =
      errorIf(isNullOrEmpty(value), new MissingIdError()) ??
      errorIf(isNotFormatted(value, Id.FORMAT), new BadIdError(value));

    if (error && options?.throwOnError) {
      throw error;
    }

    return error;
  }

  public static get FORMAT() {
    return /(\w|\d|~|-){21,}/i;
  }
}

export class MissingIdError extends CustomError {
  constructor() {
    super({
      name: "MissingIdError",
      message: `Id cannot be null or empty`,
      params: { format: Id.FORMAT },
    });
  }
}

export class BadIdError extends CustomError {
  constructor(id: string) {
    super({
      name: "BadIdError",
      message: `${id} is not a valid ID.`,
      params: { id, format: Id.FORMAT },
    });
  }
}
