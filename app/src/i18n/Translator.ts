export interface Translator {
  getMessage: (
    key: string,
    params?: { [key: string]: string },
    lang?: string
  ) => string;
}

export class TranslatorImpl implements Translator {
  public getMessage(
    key: string,
    params?: { [key: string]: string },
    lang?: string
  ) {
    return key;
  }
}
