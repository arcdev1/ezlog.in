import { CustomError } from "../errors/CustomError";
import { isNullOrEmpty, isShorterThan, isLongerThan } from "../common/utils";
import { ValueObject } from "../common/ValueObject";
import { errorIf } from "../errors";

export class OidcClientName extends ValueObject<string> {
  public static of(name: string) {
    let normalizedName = OidcClientName.normalize(name);
    OidcClientName.validate(normalizedName, {
      throwOnError: true,
      normalized: true,
    });
    return new OidcClientName(normalizedName);
  }

  public static normalize(name: string) {
    return name?.trim();
  }

  public static validate(
    name: string,
    options?: { normalized?: boolean; throwOnError?: boolean }
  ) {
    const normalizedName = options?.normalized
      ? name
      : OidcClientName.normalize(name);
    let error =
      errorIf(
        isNullOrEmpty(normalizedName),
        new MissingOidcClientNameError()
      ) ??
      errorIf(
        isShorterThan(normalizedName, OidcClientName.MIN_LENGTH),
        new OidcClientNameTooShortError({
          minLength: OidcClientName.MIN_LENGTH,
          clientName: normalizedName,
        })
      ) ??
      errorIf(
        isLongerThan(normalizedName, OidcClientName.MAX_LENGTH),
        new OidcClientNameTooLongError({
          maxLength: OidcClientName.MAX_LENGTH,
          clientName: normalizedName,
        })
      );

    if (error && options?.throwOnError) {
      throw error;
    }

    return error;
  }

  public static get MAX_LENGTH() {
    return 255;
  }

  public static get MIN_LENGTH() {
    return 2;
  }

  public toUriComponent(): string {
    return encodeURIComponent(this.toString());
  }

  public toString() {
    return this.value;
  }
}

export class MissingOidcClientNameError extends CustomError {
  constructor() {
    super({
      message: "Client name can not be empty.",
      name: "MissingOidcClientNameError",
    });
  }
}

export class OidcClientNameTooShortError extends CustomError {
  constructor(params: { minLength: number; clientName: string }) {
    super({
      message: `Client name must be at least ${params.minLength} character long.`,
      params,
      name: "OidcClientNameTooShortError",
    });
  }
}

export class OidcClientNameTooLongError extends CustomError {
  constructor(params: { maxLength: number; clientName: string }) {
    super({
      message: `Client name must be less than ${params.maxLength} character long.`,
      params,
      name: "OidcClientNameTooLongError",
    });
  }
}

export class OidcClientNameNotAvailableError extends CustomError {
  constructor(params: { alternatives: string[]; clientName: string }) {
    super({
      message: `The name "${params.clientName}" is not available.`,
      params,
      name: "ClientNameNotAvailableError",
    });
  }
}
