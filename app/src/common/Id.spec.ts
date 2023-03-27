import { Id, BadIdError, MissingIdError, IdProvider } from "./Id";
import { container, TYPES } from "../ioc";

const idProvider = container.resolve<IdProvider>(TYPES.IdProvider);

describe("id", () => {
  it("creates a unique id", async () => {
    let id1 = await idProvider.next();
    let id2 = await idProvider.next();
    expect(id1.value).not.toBe(id2.value);
  });
  it("compares", async () => {
    let id1 = await idProvider.next();
    let id2 = await idProvider.next();
    expect(id1.equals(id1)).toBe(true);
    expect(id2.equals(id2)).toBe(true);
    expect(id1.equals(id2)).toBe(false);
  });
  it("validates", () => {
    const notValid = [123, "shbvf", true, false];
    const missing = ["", null, undefined];
    const valid = "cssIEwu-YlRq_fE8aFMTv";
    notValid.forEach((id) => {
      expect(Id.validate(id as string)).toEqual(new BadIdError(id as string));
      expect(() => Id.of(id as string)).toThrowError(BadIdError);
    });
    missing.forEach((id) => {
      expect(Id.validate(id)).toEqual(new MissingIdError());
      expect(() => Id.of(id)).toThrowError(MissingIdError);
    });
    expect(Id.validate(valid)).not.toBeDefined();
  });
});
