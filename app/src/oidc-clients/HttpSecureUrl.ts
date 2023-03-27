import { CustomError } from "../errors/CustomError";
import { ValueObject } from "../common/ValueObject";
import { isNullOrEmpty, isNotFormatted } from "../common/utils/assertions";
import { errorIf } from "../errors";

export class HttpSecureUrl extends ValueObject<URL> {
  public static of(url: URL) {
    HttpSecureUrl.validate(url, { throwOnError: true });
    return new HttpSecureUrl(url);
  }

  public static fromString(url: string) {
    HttpSecureUrl.validate(url, { throwOnError: true });
    return new HttpSecureUrl(new URL(url));
  }

  public static validate(
    url: URL | string,
    options?: { throwOnError: boolean }
  ): Error {
    let urlString = url instanceof URL ? url.href : url;
    let error =
      errorIf(isNullOrEmpty(urlString), new MissingHttpSecureUrlError()) ??
      errorIf(
        isNotFormatted(urlString, HttpSecureUrl.FORMAT),
        new BadHttpSecureUrlError({ url: urlString })
      );

    if (error && options?.throwOnError) {
      throw error;
    }

    return error;
  }

  public static get FORMAT() {
    return /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
  }

  public equals(otherUrl: HttpSecureUrl) {
    return this.toString() === otherUrl.toString();
  }

  public toString() {
    return this.value.href;
  }
}

export class MissingHttpSecureUrlError extends CustomError {
  constructor() {
    super({
      name: "MissingHttpSecureUrlError",
      message: `Cannot be null or empty.`,
    });
  }
}

export class BadHttpSecureUrlError extends CustomError {
  constructor(params: { url: string }) {
    super({
      name: "BadHttpSecureUrlError",
      message: `Must begin with "https://".`,
      params,
    });
  }
}
