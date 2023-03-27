import * as faker from "faker";
import {
  OidcClientInfo,
  OidcClientRegistration,
  OidcClientRepository,
} from "./OidcClientRegistration";
import {
  MissingOidcClientNameError,
  OidcClientNameTooShortError,
} from "../OidcClientName";
import { container, TYPES } from "../../ioc";
import { IdProvider } from "../../common/Id";
import { VersionProvider } from "../../common/Version";
import { OidcClient } from "../OidcClient";
import { MissingOidcClientRedirectsError } from "../OidcClientRedirects";
import { BadHttpSecureUrlError } from "../HttpSecureUrl";

function fakeClientInfo(
  overrides: Partial<OidcClientInfo> = {}
): OidcClientInfo {
  return {
    client_name: Array(2).fill(faker.name.firstName()).join(" "),
    redirect_uris: ["https://" + faker.internet.domainName()],
    ...overrides,
  };
}

function fakeRepo() {
  let clients = [];
  return Object.freeze({
    add: (c: OidcClient) => {
      clients.push(c);
      return clients[clients.length - 1];
    },
  });
}

function createRegistration(overrides?: {
  oidcClientRepo?: OidcClientRepository;
  idProvider?: IdProvider;
  versionProvider?: VersionProvider;
}) {
  return new OidcClientRegistration({
    oidcClientRepo: fakeRepo(),
    idProvider: container.resolve<IdProvider>(TYPES.IdProvider),
    versionProvider: container.resolve<VersionProvider>(TYPES.VersionProvider),
    ...overrides,
  });
}
describe("OIDC Client Registration", () => {
  it("fails when the client name is null", async () => {
    let registration = createRegistration();
    let newClient: OidcClientInfo = fakeClientInfo({ client_name: null });
    await expect(registration.of(newClient)).rejects.toThrow(
      MissingOidcClientNameError
    );
  });

  it("fails when the client name is less than 2 characters long", async () => {
    let registration = createRegistration();
    let newClient: OidcClientInfo = fakeClientInfo({ client_name: "a" });
    await expect(registration.of(newClient)).rejects.toThrow(
      OidcClientNameTooShortError
    );
  });

  it("fails when the client does not provide at least one redirect URI", async () => {
    let registration = createRegistration();
    let newClient: OidcClientInfo = fakeClientInfo({ redirect_uris: null });
    await expect(registration.of(newClient)).rejects.toThrow(
      MissingOidcClientRedirectsError
    );
    let newClient2: OidcClientInfo = fakeClientInfo({ redirect_uris: [] });
    await expect(registration.of(newClient2)).rejects.toThrow(
      MissingOidcClientRedirectsError
    );
  });

  it("ensures redirect URIs are valid", async () => {
    let registration = createRegistration();
    let newClient: OidcClientInfo = fakeClientInfo({ redirect_uris: ["foo"] });
    await expect(registration.of(newClient)).rejects.toThrow(
      BadHttpSecureUrlError
    );
  });

  it("registers a client", async () => {
    let registration = createRegistration({
      oidcClientRepo: fakeRepo(),
    });
    let newClient: OidcClientInfo = fakeClientInfo();
    let registrant = await registration.of(newClient);
    expect(registrant.name.value).toBe(newClient.client_name);
  });
});
