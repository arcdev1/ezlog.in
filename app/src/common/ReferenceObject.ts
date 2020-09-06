import { Id } from "./Id";
import { Version } from "./Version";

export abstract class ReferenceObject {
  #id: Id;
  #version?: Version;

  constructor({ id, version }: { id: Id; version?: Version }) {
    this.#id = id;
    this.#version = version;
  }

  public equals(other: ReferenceObject) {
    return this.#id === other.#id && this.#version === other.#version;
  }
}
