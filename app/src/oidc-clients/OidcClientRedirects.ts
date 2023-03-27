import { HttpSecureUrl } from "./HttpSecureUrl";
import { ValueObject } from "../common/ValueObject";
import { errorIf } from "../errors";
import { isNullOrEmpty } from "../common/utils/assertions";
import { CustomError } from "../errors/CustomError";

export class OidcClientRedirects extends ValueObject<HttpSecureUrl[]> {
  public toString() {
    return this.toStringArray().join();
  }
  public toStringArray(): string[] {
    return this.value.map((value) => value.toString());
  }

  public static fromStringArray(redirects: string[]) {
    if (isNullOrEmpty(redirects)) {
      throw new MissingOidcClientRedirectsError();
    }
    return OidcClientRedirects.of(redirects.map(HttpSecureUrl.fromString));
  }

  public static of(value: HttpSecureUrl[]) {
    OidcClientRedirects.validate(value, { throwOnError: true });
    return new OidcClientRedirects(value);
  }

  public static validate(
    urls: HttpSecureUrl[],
    options?: { throwOnError: boolean }
  ) {
    let error = errorIf(
      isNullOrEmpty(urls),
      new MissingOidcClientRedirectsError()
    );

    if (error && options?.throwOnError) {
      throw error;
    }

    return error;
  }
}

export class MissingOidcClientRedirectsError extends CustomError {
  constructor() {
    super({
      name: "MissingOidcClientRedirectsError",
      message: "Please provide at least one redirect.",
    });
  }
}
