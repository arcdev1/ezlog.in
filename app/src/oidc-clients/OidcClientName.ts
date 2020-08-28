export class OidcClientName {
  #value: string;
  public static get MAX_LENGTH() {
    return 255;
  }

  public static get MIN_LENGTH() {
    return 2;
  }

  public static validate(name: string) {
    const normalizedName = OidcClientName.normalize(name);
    if (!normalizedName?.length) {
      return new MissingOidcClientNameError();
    }

    let error: Error;
    if (normalizedName.length < OidcClientName.MIN_LENGTH) {
      error = new OidcClientNameTooShortError({
        minLength: OidcClientName.MIN_LENGTH,
        clientName: normalizedName,
      });
    }
    if (normalizedName.length > OidcClientName.MAX_LENGTH) {
      error = new OidcClientNameTooLongError({
        maxLength: OidcClientName.MAX_LENGTH,
        clientName: normalizedName,
      });
    }
    return error;
  }

  public static normalize(name: string) {
    return name?.trim();
  }

  public static of(name: string) {
    return new OidcClientName(name);
  }

  private constructor(readonly name: string) {
    this.setName(name);
  }

  private setName(name: string) {
    let invalidName = OidcClientName.validate(name);
    if (invalidName) {
      throw invalidName;
    }
    this.#value = OidcClientName.normalize(name);
  }

  public toUriComponent(): string {
    return encodeURIComponent(this.toString());
  }

  public toString() {
    return this.value;
  }

  public get value() {
    return this.#value;
  }
}

export class MissingOidcClientNameError extends Error {
  constructor() {
    super("Client name can not be empty.");

    Error.captureStackTrace &&
      Error.captureStackTrace(this, MissingOidcClientNameError);

    this.name = "MissingOidcClientNameError";
  }
}

interface OidcClientNameTooShortErrorParams {
  minLength: number;
  clientName: string;
}

export class OidcClientNameTooShortError extends Error {
  params: OidcClientNameTooShortErrorParams;
  constructor(params: OidcClientNameTooShortErrorParams) {
    super(`Client name must be at least ${params.minLength} character long.`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, OidcClientNameTooShortError);

    this.name = "OidcClientNameTooShortError";
    this.params = params;
  }
}

interface OidcClientNameTooLongErrorParams {
  maxLength: number;
  clientName: string;
}
export class OidcClientNameTooLongError extends Error {
  #params: OidcClientNameTooLongErrorParams;
  constructor(params: OidcClientNameTooLongErrorParams) {
    super(`Client name must be at least ${params.maxLength} character long.`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, OidcClientNameTooLongError);

    this.name = "OidcClientNameTooLongError";
    this.#params = params;
  }
}

interface OidcClientNameNotAvailableParams {
  alternatives: string[];
  clientName: string;
}
export class OidcClientNameNotAvailableError extends Error {
  #params: OidcClientNameNotAvailableParams;
  constructor(params: OidcClientNameNotAvailableParams) {
    super(`The name "${params.clientName}" is not available.`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, OidcClientNameTooLongError);

    this.name = "ClientNameNotAvailableError";
    this.#params = params;
  }
}
