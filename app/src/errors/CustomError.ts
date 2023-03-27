interface CustomErrorProps {
  name: string;
  params?: { [key: string]: any };
  message?: string;
  cause?: Error;
}

export abstract class CustomError extends Error {
  #params: { [key: string]: any };
  #cause: Error;
  constructor(
    { params, message, name, cause }: CustomErrorProps = { name: "CustomError" }
  ) {
    super(message || "An unknown error occured.");
    this.#params = params;
    this.#cause = cause;
    this.name = name;

    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
  public get params() {
    return this.#params;
  }
  public get cause() {
    return this.#cause;
  }
}
