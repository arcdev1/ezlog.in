export class ValidationResult {
  #error: Error;
  public static fail(error: Error) {
    return new ValidationResult(error);
  }

  public static pass() {
    return new ValidationResult();
  }

  private constructor(error?: Error) {
    if (error) {
      this.#error = error;
    }
  }

  public get passed() {
    return !this.failed;
  }

  public get failed() {
    return Boolean(this.error);
  }

  public get error() {
    return this.#error;
  }
}
