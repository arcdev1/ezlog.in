export function isBetween(value: number, min: number, max: number) {
  return isGreaterThan(value, min) && isLessThan(value, max);
}

export function isNotBetween(value: number, min: number, max: number) {
  return !isBetween(value, min, max);
}

export function hasDecimal(value: number) {
  return Math.floor(value) !== value;
}

export function hasNoDecimal(value: number) {
  return !hasDecimal(value);
}

export function hasFormat(value: string, format: RegExp) {
  return isString(value) && format.test(value);
}

export function isNotFormatted(value: string, format: RegExp) {
  return !hasFormat(value, format);
}

export function isLongerThan(value: string, length: number) {
  return isString(value) && value.length > length;
}

export function isShorterThan(value: string, length: number) {
  return isString(value) && value.length < length;
}

export function isNotNullOrEmpty(value: string | Array<any>) {
  return !isNullOrEmpty(value);
}

export function isNullOrEmpty(value: string | Array<any>) {
  if (value == null) return true;
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNotString(value: any): value is Omit<any, string> {
  return !isString(value);
}

export function isNumber(value: any): value is number {
  return Number.isFinite(value);
}

export function isNotNumber(value: any): value is Omit<any, number> {
  return !isNumber(value);
}

export function isLessThan(value: number, min: number) {
  return value < min;
}

export function isGreaterThan(value: number, max: number) {
  return value > max;
}
