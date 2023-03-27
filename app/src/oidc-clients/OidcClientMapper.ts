import { OidcClient } from "./OidcClient";
import { OidcClientName } from "./OidcClientName";
import { Id } from "../common/Id";
import { OidcClientRedirects } from "./OidcClientRedirects";

export interface OidcClientDTO {
  application_type?: "native" | "web";
  client_id: string;
  client_name: string;
  redirect_uris: string[];
  version?: string;
}

export namespace OidcClientMapper {
  export function toDTO(client: OidcClient) {
    return Object.freeze({
      client_id: client.id.toString(),
      client_name: client.name.toString(),
      redirect_uris: client.redirects.toStringArray(),
      version: client.version.toString(),
    });
  }

  export function fromDTO(client: OidcClientDTO) {
    return OidcClient.of({
      name: OidcClientName.of(client.client_name),
      id: Id.of(client.client_id),
      redirects: OidcClientRedirects.fromStringArray(client.redirect_uris),
    });
  }
}
