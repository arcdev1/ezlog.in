import { ValidationResult } from "./ValidationResult";

describe("Validation Result", () => {
  it("passes", () => {
    const result = ValidationResult.pass();
    expect(result.passed).toBe(true);
    expect(result.failed).toBe(false);
    expect(result.error).toBeFalsy();
  });

  it("fails", () => {
    const err = new Error("Error");
    const result = ValidationResult.fail(err);
    expect(result.passed).toBe(false);
    expect(result.failed).toBe(true);
    expect(result.error).toEqual(err);
  });
});
