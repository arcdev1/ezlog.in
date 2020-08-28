import { ValidationResult } from "./ValidationResult";

interface UriOptions {
  requireHttps?: boolean;
  forceHttps?: boolean;
}

export class Uri {
  #url: URL;

  public static fromURL(url: URL, options?: UriOptions) {
    return new Uri(url, options);
  }

  public static fromString(uri: string, options?: UriOptions) {
    return new Uri(uri, options);
  }

  private constructor(
    readonly uri: string | URL,
    readonly options?: UriOptions
  ) {
    uri instanceof URL
      ? this.setUriFromUrl(uri, options)
      : this.setUriFromString(uri, options);
  }

  private setUriFromUrl(url: URL, options?: UriOptions) {
    const theUrl = url;
    if (options?.forceHttps) {
      theUrl.protocol = "https:";
    } else if (options?.requireHttps) {
      let { error } = Uri.validateSecureUrl(theUrl);
      if (error) {
        throw error;
      }
    }
    this.#url = theUrl;
  }

  private setUriFromString(uri: string, options?: UriOptions) {
    let urlString = uri;
    if (options?.forceHttps) {
      if (!urlString.startsWith("http")) {
        urlString = `https://${urlString}`;
      }
      urlString = urlString.replace("http://", "https://");
    }
    let { error } = options?.requireHttps
      ? Uri.validateSecure(urlString)
      : Uri.validate(urlString);
    if (error) {
      throw error;
    }
    this.#url = new URL(urlString);
  }

  public static get FORMAT() {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
  }
  public static get FORMAT_SECURE() {
    return /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
  }

  public get isHttps() {
    return this.#url.protocol === "https:";
  }

  public get value() {
    return this.toString();
  }

  public toString() {
    return this.#url.href;
  }
  public toURL() {
    // return a fresh copy to avoid callers
    // messing with the current instance's
    // internal state. -B
    return new URL(this.#url.href);
  }

  public static validate(uri: string) {
    try {
      if (!Uri.FORMAT.test(uri)) {
        return ValidationResult.fail(new InvalidUriError({ uri }));
      }
      new URL(uri);
      return ValidationResult.pass();
    } catch (e) {
      if (e instanceof TypeError) {
        return ValidationResult.fail(new InvalidUriError({ uri }));
      }
      throw e;
    }
  }

  public static validateSecure(uri: string) {
    try {
      const url = new URL(uri);
      return Uri.validateSecureUrl(url);
    } catch (e) {
      if (e.name === "TypeError [ERR_INVALID_URL]") {
        return ValidationResult.fail(new InvalidUriError({ uri }));
      }
      throw e;
    }
  }

  public static validateSecureUrl(url: URL) {
    return url.protocol === "https:"
      ? ValidationResult.pass()
      : ValidationResult.fail(new InsecureUriError({ uri: url.href }));
  }
}

export class InvalidUriError extends Error {
  params = {};
  constructor(params: { uri: string }) {
    super(`Uri must begin with "http://" or "https://".`);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    Error.captureStackTrace && Error.captureStackTrace(this, InvalidUriError);

    this.name = "InvalidUriError";
    this.params = params;
  }
}

export class InsecureUriError extends Error {
  params = {};
  constructor(params: { uri: string }) {
    super(`Uri must begin with "https://".`);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    Error.captureStackTrace && Error.captureStackTrace(this, InsecureUriError);

    this.name = "InsecureUriError";
    this.params = params;
  }
}
