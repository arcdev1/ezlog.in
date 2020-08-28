export abstract class ValueObject<T> {
  #value: T;

  protected constructor(value: T) {
    this.setValue(value);
  }

  protected setValue(value: T) {
    this.#value = value;
  }

  public get value() {
    return this.#value;
  }

  public equals(other: ValueObject<T>) {
    return this.value === other.value;
  }
}
