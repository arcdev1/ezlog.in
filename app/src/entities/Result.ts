export class Result<T> {
  #errors: Error[];
  #value: T;

  public static fail(errors: Error[]) {
    return new Result<undefined>({ errors });
  }

  public static succeed<T>(value: T) {
    return new Result<T>({ value });
  }

  private constructor({ errors, value }: { errors?: Error[]; value?: T }) {
    if (!errors?.length && value == null) {
      throw new Error("You must provide either an error or a value.");
    }
    this.#errors = errors;
    this.#value = value;
  }

  public get value(): T {
    return this.#value;
  }

  public get errors(): Error[] {
    return this.#errors;
  }

  public get isNotValid(): boolean {
    return Boolean(this.errors?.length);
  }

  public get isValid(): boolean {
    return !this.isNotValid;
  }

  public get message(): string {
    return this.#errors?.length ? this.#errors.join("/n") : "success";
  }
}
