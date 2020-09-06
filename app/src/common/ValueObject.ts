export abstract class ValueObject<T> {
  #value: T;

  protected constructor(value: T) {
    this.setValue(value);
  }

  protected setValue(value: T) {
    if (value == null) {
      throw new TypeError();
    }
    this.#value = value;
  }

  public toString() {
    return this.value.toString();
  }

  public equals(other: ValueObject<T>) {
    return this.value === other.value;
  }

  public get value() {
    return this.#value;
  }
}
