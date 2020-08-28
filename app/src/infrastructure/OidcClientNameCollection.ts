import { OidcClientNameCollection } from "../use-cases/oidc-client/OidcClientNameSelection";
import { OidcClientDAO, OidcClientDocument } from "./OidcClientModel";

export class OidcClientNameCollectionImpl implements OidcClientNameCollection {
  #OidcClientModel: OidcClientDAO;

  constructor({ OidcClientModel }: { OidcClientModel: OidcClientDAO }) {
    this.#OidcClientModel = OidcClientModel;
  }

  async hasAny(names: string[]) {
    const query = this.#OidcClientModel
      .query({
        clientName: { in: names },
      })
      .using("OidcClientNameIndex");

    const found = await query.exec();
    return Object.freeze(
      found?.map((item) => (item as OidcClientDocument).clientName)
    );
  }

  async has(name: string) {
    const query = this.#OidcClientModel
      .query({
        clientName: { eq: name },
      })
      .using("OidcClientNameIndex");
    const found = await query.exec();
    if (found.count > 0) {
      return name;
    }
  }
}
