export interface Validation {
  isValid: boolean;
  message: string;
  params: { [key: string]: any };
}

export class ValidationError extends Error {
  params: { [key: string]: any };
  isValid: boolean;
  constructor(validation: Validation) {
    super(validation.message);
    this.name = "ValidationError";
    this.params = validation.params;
    this.isValid = validation.isValid;
  }
}

export class ValidationListError extends Error {
  validationList: Validation[];
  constructor(validationList: Validation[]) {
    super(
      validationList.reduce((msg, val) => msg + `- ${val.message}\n`, "").trim()
    );
    this.name = "ValidationListError";
    this.validationList = validationList;
  }
}
