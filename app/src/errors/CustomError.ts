interface CustomErrorProps {
  name: string;
  params?: { [key: string]: any };
  message?: string;
}

export abstract class CustomError extends Error {
  #params;
  constructor(
    { params, message, name }: CustomErrorProps = { name: "CustomError" }
  ) {
    super(message || "An unknown error occured.");
    this.#params = params;
    this.name = name;

    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
  public get params() {
    return this.#params;
  }
}
