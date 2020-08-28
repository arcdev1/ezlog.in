import deepmerge from "deepmerge";

export function merge<T>(a: Partial<T>, b: Partial<T>): T {
  return deepmerge(a, b);
}

export function overwrite<T>({
  original,
  changes,
}: {
  original: T;
  changes: Partial<T>;
}): T {
  return merge<T>(original, changes);
}
