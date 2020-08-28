export interface RequestedName {
  value: string;
  isAvailable: boolean;
  isNotAvailable: boolean;
  alternatives?: string[];
}
