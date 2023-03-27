import { isNullOrEmpty, isNotNullOrEmpty } from "./assertions";

describe("utils", () => {
  it("is null or empty", () => {
    expect(isNullOrEmpty(null)).toBe(true);
    expect(isNullOrEmpty(undefined)).toBe(true);
    expect(isNullOrEmpty("")).toBe(true);
    expect(isNullOrEmpty(" ")).toBe(true);
    expect(isNullOrEmpty([])).toBe(true);
    expect(isNullOrEmpty("A")).toBe(false);
    expect(isNullOrEmpty([1])).toBe(false);
  });
  it("is not null or empty", () => {
    expect(isNotNullOrEmpty(null)).toBe(false);
    expect(isNotNullOrEmpty(undefined)).toBe(false);
    expect(isNotNullOrEmpty("")).toBe(false);
    expect(isNotNullOrEmpty(" ")).toBe(false);
    expect(isNotNullOrEmpty([])).toBe(false);
    expect(isNotNullOrEmpty("A")).toBe(true);
    expect(isNotNullOrEmpty([1])).toBe(true);
  });
});
