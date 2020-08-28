import { OidcClient } from "../../entities/oidc-client/OidcClient";
import { OidcClientName } from "../../entities/oidc-client/OidcClientName";
import { HttpSecureUrl } from "../../entities/HttpSecureUrl";
import { IdFactory } from "../../entities/IdFactory";

export interface OidcClientList {
  add: (client: OidcClient) => void;
}

export interface RegisterOidcClientParams {
  name: string;
  redirectURIs: string[];
}

export class RegisterOidcClient {
  #clientList: OidcClientList;
  #idFactory: IdFactory;
  constructor({
    clientList,
    idFactory,
  }: {
    clientList: OidcClientList;
    idFactory: IdFactory;
  }) {
    this.#clientList = clientList;
    this.#idFactory = idFactory;
  }

  public register({ name, redirectURIs }: RegisterOidcClientParams) {
    this.validateRegistration({ name, redirectURIs });
    let newClient = OidcClient.create({
      id: this.#idFactory.nextId(),
      name: OidcClientName.of(name),
      redirectUris: redirectURIs.map(HttpSecureUrl.fromString),
    });
    this.#clientList.add(newClient);
  }

  private validateRegistration({
    name,
    redirectURIs,
  }: RegisterOidcClientParams) {
    let errors: Error[] = [];
    let clientNameError = OidcClientName.validate(name);
    clientNameError && errors.push(clientNameError);
    redirectURIs.forEach((uri) => {
      let error = HttpSecureUrl.validate(uri);
      if (error) {
        errors.push(error);
      }
    });
    if (errors.length) {
      throw new InvalidClientRegistrationRequest(errors);
    }
  }

  public get REQUIRED_PARAMS() {
    return ["name", "redirectURIs"];
  }
}

export class InvalidClientRegistrationRequest extends Error {
  #errors: Error[];
  constructor(errors: Error[]) {
    super();

    Error.captureStackTrace &&
      Error.captureStackTrace(this, InvalidClientRegistrationRequest);

    this.#errors = errors;
    this.name = "InvalidClientRegistrationRequest";
    let innerMessages = errors.reduce(
      (msg, err) => msg + `\n${err.message}`,
      ""
    );
    this.message = `One or more errors occured: \n${innerMessages}`;
  }
}
