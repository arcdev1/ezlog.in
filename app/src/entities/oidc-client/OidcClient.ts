import { Id } from "../IdFactory";
import { OidcClientName } from "./OidcClientName";
import { HttpSecureUrl } from "../HttpSecureUrl";

export type OidcResponseType = "code" | "token" | "id_token";
export type OidcGrantType = "authorization_code" | "implicit";
export type OidcApplicationType = "native" | "web";

interface OidcClientProps {
  id: Id;
  name: OidcClientName;
  redirectUris: HttpSecureUrl[];
  // applicationType?: OidcApplicationType;
  // clientUri?: Uri;
  // grantTypes?: OidcGrantType[];
  // logoUri?: Uri;
  // responseTypes?: OidcResponseType[];
  // tosUri?: Uri;
}

export interface OidcClientId extends Id {}

export class OidcClient {
  #id: Id;
  #name: OidcClientName;
  #redirectUris: HttpSecureUrl[];

  public static get REQUIRED_FIELDS(): Array<keyof OidcClientProps> {
    return ["id", "name", "redirectUris"];
  }

  public static create({ id, name, redirectUris }: OidcClientProps) {
    return new OidcClient({ id, name, redirectUris });
  }

  private constructor({ id, name, redirectUris }: OidcClientProps) {
    this.setId(id);
    this.setName(name);
    this.setRedirectUris(redirectUris);
  }

  private setId(id: Id) {
    this.#id = id;
  }
  public get id() {
    return this.#id.value;
  }

  private setName(name: OidcClientName) {
    this.#name = name;
  }
  public get name() {
    return this.#name;
  }

  private setRedirectUris(uris: HttpSecureUrl[]) {
    this.#redirectUris = uris;
  }
  public get redirectUris() {
    return this.#redirectUris;
  }
}
