import * as faker from "faker";
import {
  OidcClientInfo,
  OidcClientRegistration,
} from "./OidcClientRegistration";
import {
  MissingOidcClientNameError,
  OidcClientNameTooShortError,
} from "../OidcClientName";

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
    add: clients.push,
    items: () => Object.freeze(clients),
  });
}

describe("OIDC Client Registration", () => {
  it("fails when the client name is null", async () => {
    let registration = new OidcClientRegistration({
      oidcClientRepo: fakeRepo(),
    });
    let newClient: OidcClientInfo = fakeClientInfo({ client_name: null });
    await expect(registration.of(newClient)).rejects.toThrow(
      MissingOidcClientNameError
    );
  });

  it("fails when the client name is less than 2 characters long", async () => {
    let registration = new OidcClientRegistration({
      oidcClientRepo: fakeRepo(),
    });
    let newClient: OidcClientInfo = fakeClientInfo({ client_name: "a" });
    await expect(registration.of(newClient)).rejects.toThrow(
      OidcClientNameTooShortError
    );
  });

  it("fails when the client does not provide at least one redirect URI", async () => {
    let registration = new OidcClientRegistration({
      oidcClientRepo: fakeRepo(),
    });
    let newClient: OidcClientInfo = fakeClientInfo({ redirect_uris: null });
    await expect(registration.of(newClient)).rejects.toThrow(
      MissingRedirectsError
    );
    let newClient2: OidcClientInfo = fakeClientInfo({ redirect_uris: [] });
    await expect(registration.of(newClient2)).rejects.toThrow(
      MissingRedirectsError
    );
  });

  it("ensures redirect URIs are valid", async () => {
    let registration = new OidcClientRegistration({
      oidcClientRepo: fakeRepo(),
    });
    let newClient: OidcClientInfo = fakeClientInfo({ redirect_uris: ["foo"] });
    await expect(registration.of(newClient)).rejects.toThrow(
      BadRedirectUriError
    );
  });

  it("registers a client", async () => {
    let registration = new OidcClientRegistration({
      oidcClientRepo: fakeRepo(),
    });
    let newClient: OidcClientInfo = fakeClientInfo();
    let registrant = await registration.of(newClient);
    expect(registrant.client_name).toBe(newClient.client_name);
  });
});
