import { RequestedName } from "../../entities/RequestedName";
import { UseCase } from "../../entities/UseCase";
import { Result } from "../../entities/Result";

export interface NameCollection {
  has: (name: string) => Promise<string>;
  hasAny: (names: string[]) => Promise<Readonly<string[]>>;
}

export class NameSelection implements UseCase<RequestedName> {
  #nameCollection: NameCollection;

  constructor(nameCollection: NameCollection) {
    this.#nameCollection = nameCollection;
  }

  public async execute(
    name: string,
    options?: {
      suggestAlternatives?: boolean;
    }
  ): Promise<Result<RequestedName>> {
    let alternatives: string[];
    let found: string | string[];
    let isAvailable: boolean;

    if (!name?.length) {
      return Result.fail([new MissingNameError()]);
    }

    if (options?.suggestAlternatives) {
      alternatives = await this.findWithAlternatives(name);
      isAvailable = alternatives?.includes(name);
    } else {
      found = await this.#nameCollection.has(name);
      isAvailable = name !== found;
    }

    return Result.succeed<RequestedName>({
      isAvailable,
      isNotAvailable: isAvailable === false,
      value: name,
      alternatives,
    });
  }

  private async findWithAlternatives(name: string) {
    let alternatives: string[];
    let found: Readonly<string[]>;
    let isAvailable: boolean;
    const names = [name].concat(this.deriveAlternatives(name));

    found = await this.#nameCollection.hasAny(names);
    isAvailable = found.includes(name);
    if (isAvailable === false) {
      alternatives = found.filter((alt) => alt !== name);
    }
    return alternatives;
  }

  private deriveAlternatives(name: string) {
    let alts = new Set<string>();
    if (!name.toLowerCase().startsWith("the")) {
      alts.add(`the${name[0].toUpperCase()}${name.substring(1)}`);
      alts.add(`the-${name}`);
    }
    if (!name.endsWith("1")) {
      alts.add(`${name}1`);
    }
    if (!name.endsWith("2")) {
      alts.add(`${name}2`);
    }
    alts.add(`${name}Too`);
    alts.add(`${name}${Math.floor(Math.random() * 10000)}`);
    alts.add(`${name}${Math.floor(Math.random() * 10000)}`);
    return Array.from(alts);
  }
}

export class MissingNameError extends Error {
  constructor() {
    super("Name can not be empty.");

    Error.captureStackTrace && Error.captureStackTrace(this, MissingNameError);

    this.name = "MissingNameError";
  }
}
