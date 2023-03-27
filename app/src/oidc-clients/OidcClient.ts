import { Id, IdProvider } from "../common/Id";
import { ReferenceObject } from "../common/ReferenceObject";
import { Version, VersionProvider } from "../common/Version";
import { OidcClientName } from "./OidcClientName";
import { OidcClientRedirects } from "./OidcClientRedirects";

interface OidcClientProps {
  id: Id;
  name: OidcClientName;
  version?: Version;
  redirects: OidcClientRedirects;
  applicationType?: "native" | "web";
}

export class OidcClient extends ReferenceObject {
  #name: OidcClientName;
  #redirects: OidcClientRedirects;
  #applicationType?: "native" | "web";

  public static async register(
    props: {
      name: OidcClientName;
      redirects: OidcClientRedirects;
    },
    config: {
      idProvider: IdProvider;
      versionProvider: VersionProvider;
    }
  ) {
    return OidcClient.of({
      id: await config.idProvider.next(),
      name: props.name,
      redirects: props.redirects,
      version: await config.versionProvider.next(),
    });
  }

  public static of(props: OidcClientProps) {
    return new OidcClient(props);
  }

  private constructor(props: OidcClientProps) {
    super(props);
    this.#name = props.name;
    this.#redirects = props.redirects;
    this.#applicationType = props.applicationType;
  }

  public rename(name: OidcClientName) {
    this.#name = name;
  }

  public get name() {
    return this.#name;
  }

  public get redirects() {
    return this.#redirects;
  }

  public get applicationType() {
    return this.#applicationType;
  }
}
