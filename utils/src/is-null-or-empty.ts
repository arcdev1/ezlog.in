export function isNullOrEmpty(s?: string): boolean {
  return !s?.trim();
}

export function isNullOrEmptyArray(
  a?: Array<any> | Readonly<Array<any>>
): boolean {
  return !a?.length;
}
