import { Id } from "./IdFactory";

export abstract class ReferenceObject {
  #id: Id;

  protected setId(id: Id) {
    this.#id = id;
  }

  public get id(): Id {
    return this.#id;
  }
}
