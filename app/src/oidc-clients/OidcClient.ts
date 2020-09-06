import { Id, IdProvider } from "../common/Id";
import { ReferenceObject } from "../common/ReferenceObject";
import { Version, VersionProvider } from "../common/Version";
import { OidcClientName } from "./OidcClientName";
import { HttpSecureUrl } from "./HttpSecureUrl";

interface OidcClientProps {
  id: Id;
  name: OidcClientName;
  version?: Version;
  redirects: HttpSecureUrl[];
}

interface RegisterProps {
  name: string;
  redirects: string[];
}

interface RegisterOptions {
  idProvider: IdProvider;
  versionProvider: VersionProvider;
}

export class OidcClient extends ReferenceObject {
  #name: OidcClientName;
  #redirects: HttpSecureUrl[];

  public static register(props: RegisterProps, options: RegisterOptions) {
    return OidcClient.of({
      id: options.idProvider.next(),
      name: OidcClientName.of(props.name),
      redirects: props.redirects.map(HttpSecureUrl.fromString),
      version: options.versionProvider.next(),
    });
  }

  public static of(props: OidcClientProps) {
    return new OidcClient(props);
  }

  private constructor(props: OidcClientProps) {
    super(props);
    this.#name = props.name;
    this.#redirects = props.redirects;
  }

  public rename(name: OidcClientName) {
    this.#name = name;
  }

  public get name(): OidcClientName {
    return this.#name;
  }

  public get redirects(): HttpSecureUrl[] {
    return this.#redirects;
  }
}
