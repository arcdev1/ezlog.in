import { OidcClient } from "../OidcClient";
import { IdProvider } from "../../common/Id";
import { VersionProvider } from "../../common/Version";
import { OidcClientName } from "../OidcClientName";
import { OidcClientRedirects } from "../OidcClientRedirects";

export interface OidcClientInfo {
  application_type?: "native" | "web";
  client_name: string;
  grant_types?: string[];
  redirect_uris: string[];
}

export interface OidcClientRepository {
  save: (client: OidcClient) => Promise<OidcClient>;
}

export class OidcClientRegistration {
  #oidcClientRepo: OidcClientRepository;
  #idProvider: IdProvider;
  #versionProvider: VersionProvider;

  public async of({ client_name, redirect_uris }: OidcClientInfo) {
    let clientProps = {
      name: OidcClientName.of(client_name),
      redirects: OidcClientRedirects.fromStringArray(redirect_uris),
    };

    let config = {
      idProvider: this.#idProvider,
      versionProvider: this.#versionProvider,
    };

    let newClient = await OidcClient.register(clientProps, config);

    return this.#oidcClientRepo.save(newClient);
  }
  public REQUIRED_PARAMS = ["redirect_uris", "client_name"];
  constructor({
    oidcClientRepo,
    idProvider,
    versionProvider,
  }: {
    oidcClientRepo: OidcClientRepository;
    idProvider: IdProvider;
    versionProvider: VersionProvider;
  }) {
    this.#oidcClientRepo = oidcClientRepo;
    this.#idProvider = idProvider;
    this.#versionProvider = versionProvider;
  }
}
