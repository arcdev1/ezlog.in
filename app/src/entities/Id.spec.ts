import { container, TYPES } from "../ioc";
import { IdFactory } from "./IdFactory";

describe("Id", () => {
  const idFactory = container.resolve<IdFactory>(TYPES.IdFactory);
  const makeId = idFactory.nextId.bind(idFactory);
  it("creates a new unique id", () => {
    const newId = makeId();
    expect(newId).toBeDefined();
    expect(newId.constructor.name).toBe("IdImpl");
    expect(typeof newId.value).toBeDefined();
    expect(typeof newId.toString()).toBe("string");

    const anotherId = makeId();
    expect(anotherId.toString()).not.toBe(newId.toString());
    expect(anotherId.equals(newId)).toBe(false);
  });
  it("compares Ids", () => {
    const id1 = makeId();
    const id2 = idFactory.idOf(id1.toString());
    expect(id1.equals(id2)).toBe(true);
    expect(id1).toEqual(id2);
    const id3 = makeId();
    console.log(id3.value, id3.toString());
    expect(id1.equals(id3)).toBe(false);
  });

  it("creates an id from a string", () => {
    const idString = makeId().toString();
    const newId = idFactory.idOf(idString);
    expect(newId.toString()).toBe(idString);
  });

  it("validates an id", () => {
    const valid = "cssIEwu-YlRq_fE8aFMTv";
    const invalid = [
      "dshvkj!",
      "!!",
      "~!@#$%^&*()_)(*&^%$#@#$%^&*()",
      null,
      undefined,
      "",
    ];
    expect.assertions(13);
    const idValidation = idFactory.validate(valid);
    expect(idValidation).not.toBeDefined();
    invalid.forEach((badId) => {
      let validation = idFactory.validate(badId);
      expect(validation).toBeDefined();
      expect(validation.name).toBe("InvalidIdError");
    });
  });

  it("throws on invalid id", () => {
    const invalid = [
      "dshvkj!",
      "!!",
      "~!@#$%^&*()_)(*&^%$#@#$%^&*()",
      null,
      undefined,
      "",
    ];
    expect.assertions(invalid.length);
    invalid.forEach((badId) => {
      expect(() => idFactory.idOf(badId)).toThrow();
    });
  });
});
