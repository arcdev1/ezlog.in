export function errorIf(hasError: boolean, err: Error) {
  if (hasError) {
    return err;
  }
}
