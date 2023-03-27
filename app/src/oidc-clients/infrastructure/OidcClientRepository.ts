import { DbClient } from "../../common/infrastructure/DbClient";
import { OidcClientRepository } from "../use-case/OidcClientRegistration";
import { OidcClient } from "../OidcClient";
import { OidcClientModel } from "./OidcClientModel";

export class OidcClientRepositoryImpl implements OidcClientRepository {
  #dbClient: DbClient;
  constrcutor({ dbClient }: { dbClient: DbClient }) {
    this.#dbClient = dbClient;
  }

  public async save(client: OidcClient) {
    let model = OidcClientModel.fromOidcClient(client);
    const result = await this.#dbClient.put(model);
    return result.toOidcClient();
  }
}
