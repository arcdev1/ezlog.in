import { CustomError } from "./CustomError";
import { Translator } from "../i18n/Translator";

type Logger = Console;
export interface ErrorHandlerProps {
  translator: Translator;
  logger?: Logger;
  language?: string;
}

export class ErrorHandler {
  #translator: Translator;
  #logger: Logger;
  #language: string;
  constructor(props: ErrorHandlerProps) {
    this.#translator = props.translator;
    this.#logger = props.logger || console;
    this.#language = props.language || "en";
  }
  public translate(error: CustomError, lang?: string) {
    return this.#translator.getMessage(error.name, error.params, lang);
  }
  public handle(error: Error) {}
}
