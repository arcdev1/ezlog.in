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
      return new MissingClientNameError();
    }

    let error: Error;
    if (normalizedName.length < OidcClientName.MIN_LENGTH) {
      error = new ClientNameTooShortError({
        minLength: OidcClientName.MIN_LENGTH,
        clientName: normalizedName,
      });
    }
    if (normalizedName.length > OidcClientName.MAX_LENGTH) {
      error = new ClientNameTooLongError({
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

export class MissingClientNameError extends Error {
  constructor() {
    super("Client name can not be empty.");

    Error.captureStackTrace &&
      Error.captureStackTrace(this, MissingClientNameError);

    this.name = "MissingClientNameError";
  }
}

interface ClientNameTooShortErrorParams {
  minLength: number;
  clientName: string;
}

export class ClientNameTooShortError extends Error {
  params: ClientNameTooShortErrorParams;
  constructor(params: ClientNameTooShortErrorParams) {
    super(`Client name must be at least ${params.minLength} character long.`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, ClientNameTooShortError);

    this.name = "ClientNameTooShortError";
    this.params = params;
  }
}

interface ClientNameTooLongErrorParams {
  maxLength: number;
  clientName: string;
}
export class ClientNameTooLongError extends Error {
  #params: ClientNameTooLongErrorParams;
  constructor(params: ClientNameTooLongErrorParams) {
    super(`Client name must be at least ${params.maxLength} character long.`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, ClientNameTooLongError);

    this.name = "ClientNameTooLongError";
    this.#params = params;
  }
}

interface ClientNameNotAvailableParams {
  alternatives: string[];
  clientName: string;
}
export class ClientNameNotAvailableError extends Error {
  #params: ClientNameNotAvailableParams;
  constructor(params: ClientNameNotAvailableParams) {
    super(`The name "${params.clientName}" is not available.`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, ClientNameTooLongError);

    this.name = "ClientNameNotAvailableError";
    this.#params = params;
  }
}
