export class HttpUrl {
  #url: URL;

  public static get FORMAT() {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
  }

  public static validate(theUrl: URL | string) {
    try {
      const url = typeof theUrl === "string" ? new URL(theUrl) : theUrl;
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return new InvalidHttpUrlError({ url: url.toString() });
      }
    } catch (e) {
      if (e.name === "TypeError") {
        return e;
      }
      throw e;
    }
  }

  public static fromString(url: string) {
    return new HttpUrl(new URL(url));
  }

  public static fromUrl(url: URL) {
    return new HttpUrl(url);
  }

  private constructor(url: URL) {
    this.setUrl(url);
  }

  private setUrl(url: URL) {
    const invalidHttpUrl = HttpUrl.validate(url);
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

  public equals(otherUrl: HttpUrl) {
    return this.toString() === otherUrl.toString();
  }
}

export class InvalidHttpUrlError extends Error {
  params = {};
  constructor(params: { url: string }) {
    super(`Must begin with "http://" or "https://".`);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, InvalidHttpUrlError);

    this.name = "InvalidHttpUrlError";
    this.params = params;
  }
}
