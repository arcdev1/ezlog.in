import { ValueObject } from "./ValueObject";
import { CustomError } from "../errors/CustomError";
import { isNotNumber, hasNoDecimal, isNotBetween } from "./utils/assertions";
import { errorIf } from "../errors/";

export type PrimitiveVersionFn = () => number | Promise<number>;

export interface VersionProvider {
  next: () => Version | Promise<Version>;
}

export class VersionProviderImpl implements VersionProvider {
  #primitiveVersion: PrimitiveVersionFn;

  constructor({ primitiveVersion }: { primitiveVersion: PrimitiveVersionFn }) {
    this.#primitiveVersion = primitiveVersion;
  }

  public async next() {
    return Version.of(await this.#primitiveVersion());
  }
}

export class Version extends ValueObject<number> {
  public static of(value: number) {
    Version.validate(value, { throwOnError: true });
    return new Version(value);
  }

  public static validate(value: number, options?: { throwOnError: boolean }) {
    let min = Version.MIN;
    let max = Version.MAX;
    let error =
      errorIf(isNotNumber(value), new BadVersionNumberError(value)) ??
      errorIf(hasNoDecimal(value), new BadVersionNumberError(value)) ??
      errorIf(isNotBetween(value, min, max), new VersionOutOfRangeError(max));

    if (error && options?.throwOnError) {
      throw error;
    }
    return error;
  }

  public static get MAX() {
    return Date.now() + Version.CLOCKSKEW_IN_MS;
  }

  public static get MIN() {
    return 1597723200000; // new Date("August 18, 2020").valueOf()
  }

  private static get CLOCKSKEW_IN_MS() {
    return 120000; // 2 minutes
  }
}

export class BadVersionNumberError extends CustomError {
  constructor(readonly value: number) {
    super({
      name: "BadVersionNumberError",
      message: `Version number ${value} must be a decimal`,
      params: { value },
    });
  }
}

export class VersionOutOfRangeError extends CustomError {
  constructor(max?: number) {
    super({
      name: "VersionRangeError",
      params: { min: Version.MIN, max: max || Version.MAX },
      message: `Version must be between ${Version.MIN} and ${
        max || Version.MAX
      }`,
    });
  }
}
