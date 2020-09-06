import { OidcClientName } from "../OidcClientName";
import { OidcClient } from "../../entities/oidc-client/OidcClient";
import { HttpSecureUrl } from "../HttpSecureUrl";

export interface OidcClientInfo {
  application_type?: "native" | "web";
  client_name: string;
  grant_types?: string[];
  redirect_uris: string[];
}

export interface OidcClientRepository {
  add(client: OidcClient);
}

export class OidcClientRegistration {
  #oidcClientRepo;
  public async of({ client_name, redirect_uris }: OidcClientInfo) {
    let clientName = OidcClientName.of(client_name);
    let redirects = redirect_uris.forEach(HttpSecureUrl.fromString);

    return {
      client_name: clientName.value,
      redirect_uris: redirects,
    };
  }
  public REQUIRED_PARAMS = ["redirect_uris", "client_name"];
  constructor({ oidcClientRepo }: { oidcClientRepo: OidcClientRepository }) {
    this.#oidcClientRepo = oidcClientRepo;
  }
}
