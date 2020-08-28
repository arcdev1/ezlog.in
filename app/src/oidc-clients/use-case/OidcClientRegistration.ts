import { OidcClientName } from "../OidcClientName";

export interface OidcClientInfo {
  name: string;
  redirectURIs;
}

export class OidcClientRegistration {
  public async of({ name, redirectURIs }: OidcClientInfo) {
    let clientName = OidcClientName.of(name);
    if (!redirectURIs?.length) {
      throw new MissingRedirectUriError();
    }
    return {
      name: clientName.value,
    };
  }
}

export class MissingRedirectUriError extends Error {}
