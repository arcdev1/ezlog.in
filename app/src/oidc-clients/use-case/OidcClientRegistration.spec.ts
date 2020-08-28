import * as faker from "faker";
import {
  OidcClientInfo,
  OidcClientRegistration,
  MissingRedirectUriError,
} from "./OidcClientRegistration";
import {
  MissingOidcClientNameError,
  OidcClientNameTooShortError,
} from "../OidcClientName";

function fakeClientInfo(
  overrides: Partial<OidcClientInfo> = {}
): OidcClientInfo {
  return {
    name: faker.name.firstName(),
    redirectURIs: [faker.internet.url()],
    ...overrides,
  };
}

describe("OIDC Client Registration", () => {
  it("ensures the client name is not null", async () => {
    let registration = new OidcClientRegistration();
    let newClient: OidcClientInfo = fakeClientInfo({ name: null });
    await expect(registration.of(newClient)).rejects.toThrow(
      MissingOidcClientNameError
    );
  });

  it("ensures the client name is at least 2 characters long", async () => {
    let registration = new OidcClientRegistration();
    let newClient: OidcClientInfo = fakeClientInfo({ name: "a" });
    await expect(registration.of(newClient)).rejects.toThrow(
      OidcClientNameTooShortError
    );
  });

  it("ensures the client provides at least one redirect URI", async () => {
    let registration = new OidcClientRegistration();
    let newClient: OidcClientInfo = fakeClientInfo({ redirectURIs: null });
    await expect(registration.of(newClient)).rejects.toThrow(
      MissingRedirectUriError
    );
    let newClient2: OidcClientInfo = fakeClientInfo({ redirectURIs: [] });
    await expect(registration.of(newClient2)).rejects.toThrow(
      MissingRedirectUriError
    );
  });

  it("registers a client", async () => {
    let registration = new OidcClientRegistration();
    let newClient: OidcClientInfo = fakeClientInfo();
    let registrant = await registration.of(newClient);
    expect(registrant.name).toBe(newClient.name);
  });
});
