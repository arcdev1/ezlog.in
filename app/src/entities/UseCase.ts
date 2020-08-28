import { Result } from "./Result";

export interface UseCase<T> {
  execute: (params?: any) => Promise<Result<T>>;
}
