import {
  Version,
  BadVersionNumberError,
  VersionOutOfRangeError,
} from "./Version";

describe("version", () => {
  it("creates a unique version", () => {
    let v1 = Version.next();
    let v2 = Version.next();
    expect(v1.value).not.toBe(v2.value);
  });
  it("compares", () => {
    let v1 = Version.next();
    let v2 = Version.next();
    expect(v1.equals(v1)).toBe(true);
    expect(v2.equals(v2)).toBe(true);
    expect(v1.equals(v2)).toBe(false);
  });
  it("validates", () => {
    const notValid = [
      123,
      "shbvf",
      true,
      false,
      Date.now(),
      "",
      null,
      undefined,
    ];
    const outOfRange = [1597723100000.12, Date.now() + 500000.1];
    const valid = 1598952855231.4116;
    notValid.forEach((v) => {
      expect(Version.validate(v as number)).toEqual(
        new BadVersionNumberError(v as number)
      );
      expect(() => Version.of(v as number)).toThrowError(BadVersionNumberError);
    });
    outOfRange.forEach((v) => {
      expect(Version.validate(v)).toBeInstanceOf(VersionOutOfRangeError);
      expect(() => Version.of(v)).toThrowError(VersionOutOfRangeError);
    });
    expect(Version.validate(valid)).not.toBeDefined();
  });
});
