import { NameSelection, NameCollection } from "../supporting/NameSelection";
import { OidcClientName } from "../../entities/oidc-client/OidcClientName";
import { UseCase } from "../../entities/UseCase";
import { RequestedName } from "../../entities/RequestedName";
import { Result } from "../../entities/Result";

export interface OidcClientNameCollection extends NameCollection {}

export class OidcClientNameSelection implements UseCase<RequestedName> {
  #nameSelection: NameSelection;

  constructor({
    oidcClientNameCollection,
  }: {
    oidcClientNameCollection: OidcClientNameCollection;
  }) {
    this.#nameSelection = new NameSelection(oidcClientNameCollection);
  }

  public async execute(
    name: string,
    options?: { suggestAlternatives?: boolean }
  ) {
    let clientName = OidcClientName.of(name);
    return this.#nameSelection.execute(clientName.value, options);
  }
}
