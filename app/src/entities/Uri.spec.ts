import { Uri, InsecureUriError, InvalidUriError } from "./Uri";

describe("Uri", () => {
  const uriString = "https://www.google.com/";

  it("can be constructed from a string", () => {
    const uri = Uri.fromString(uriString);
    expect(uri.toString()).toBe(uriString);
    expect(uri.toURL().href).toBe(uriString);
  });

  it("can be constructed from a URL", () => {
    const url = new URL(uriString);
    const uri = Uri.fromURL(url);
    expect(uri.toString()).toBe(uriString);
    expect(uri.toURL().href).toBe(uriString);
  });

  it("validates plain Uris", () => {
    const badUriValidation = Uri.validate("4iu3v4216~!!#@^??é");
    expect(badUriValidation.passed).toBe(false);
    expect(badUriValidation.failed).toBe(true);
    expect(badUriValidation.error?.name).toBe("InvalidUriError");

    const noProtocolValidation = Uri.validate("google.com");
    expect(noProtocolValidation.passed).toBe(false);
    expect(noProtocolValidation.failed).toBe(true);
    expect(noProtocolValidation.error?.name).toBe("InvalidUriError");

    const goodValidation = Uri.validate(uriString);
    expect(goodValidation.passed).toBe(true);
    expect(goodValidation.failed).toBe(false);
    expect(goodValidation.error).toBeFalsy();
  });

  it("validates secure Uris", () => {
    const insecureUriValidation = Uri.validateSecure("http://yahoo.com");
    expect(insecureUriValidation.passed).toBe(false);
    expect(insecureUriValidation.failed).toBe(true);
    expect(insecureUriValidation.error?.name).toBe("InsecureUriError");

    const goodValidation = Uri.validateSecure(uriString);
    expect(goodValidation.passed).toBe(true);
    expect(goodValidation.failed).toBe(false);
    expect(goodValidation.error).toBeFalsy();

    const badUriValidation = Uri.validateSecure("4iu3v4216~!!#@^??é");
    expect(badUriValidation.passed).toBe(false);
    expect(badUriValidation.failed).toBe(true);
    expect(badUriValidation.error?.name).toBe("InvalidUriError");
  });

  it("can be converted to a string", () => {
    const url = Uri.fromURL(new URL(uriString));
    expect(url.toString()).toBe(uriString);
  });

  it("can be converted to a URL", () => {
    const url = Uri.fromString(uriString);
    expect(url.toURL() instanceof URL).toBe(true);
  });

  it("requires https", () => {
    const nonSecure = "http://yahoo.com";
    const secure = "https://yahoo.com";
    expect(() => Uri.fromString(nonSecure, { requireHttps: true })).toThrow(
      InsecureUriError
    );
    expect(() => Uri.fromString(secure, { requireHttps: true })).not.toThrow();
    expect(Uri.fromString(secure).isHttps).toBe(true);
  });

  it("forces https", () => {
    const nonSecure = "http://yahoo.com/";
    const secure = Uri.fromString(nonSecure, {
      forceHttps: true,
      requireHttps: true,
    });
    expect(secure.isHttps).toBe(true);
    expect(secure.value).toBe("https://yahoo.com/");
  });

  it("determines https", () => {
    const nonSecure = Uri.fromString("http://yahoo.com");
    const secure = Uri.fromString("https://yahoo.com/");
    expect(nonSecure.isHttps).toBe(false);
    expect(secure.isHttps).toBe(true);
  });
});
