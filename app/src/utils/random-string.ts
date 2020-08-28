import { customAlphabet as makeSecureRandomStringGenerator } from "nanoid";
import { customAlphabet as makeRandomStringGenerator } from "nanoid/non-secure";

interface RandomStringProps {
  length: number;
  allowableCharacters: string;
}

export namespace StringGenerator {
  export function makeRandomString(options: RandomStringProps) {
    return generateString({ ...options, secure: false });
  }

  export function makeSecureRandomString(options: RandomStringProps) {
    return generateString({ ...options, secure: true });
  }

  function generateString({
    length,
    allowableCharacters,
    secure,
  }: RandomStringProps & {
    secure: boolean;
  }) {
    const generate = secure
      ? makeSecureRandomStringGenerator(allowableCharacters, length)
      : makeRandomStringGenerator(allowableCharacters, length);
    return generate();
  }
}
