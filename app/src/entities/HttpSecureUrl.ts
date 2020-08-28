export class HttpSecureUrl {
  #url: URL;

  public static get FORMAT() {
    return /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
  }

  public static validate(theUrl: URL | string): Error {
    try {
      const url = typeof theUrl === "string" ? new URL(theUrl) : theUrl;
      if (url.protocol !== "https:") {
        return new InvalidHttpSecureUrlError({ url: url.toString() });
      }
    } catch (e) {
      if (e.name === "TypeError") {
        return e;
      }
      throw e;
    }
  }

  public static fromString(url: string) {
    return new HttpSecureUrl(new URL(url));
  }

  public static fromUrl(url: URL) {
    return new HttpSecureUrl(url);
  }

  private constructor(url: URL) {
    this.setUrl(url);
  }

  private setUrl(url: URL) {
    const invalidHttpUrl = HttpSecureUrl.validate(url);
    if (invalidHttpUrl) {
      throw invalidHttpUrl;
    }
    this.#url = url;
  }

  public get value(): URL {
    return this.#url;
  }

  public toString() {
    return this.value.href;
  }

  public equals(otherUrl: HttpSecureUrl) {
    return this.toString() === otherUrl.toString();
  }
}

export class InvalidHttpSecureUrlError extends Error {
  params = {};
  constructor(params: { url: string }) {
    super(`Must begin with "https://".`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, InvalidHttpSecureUrlError);

    this.name = "InvalidHttpSecureUrlError";
    this.params = params;
  }
}
