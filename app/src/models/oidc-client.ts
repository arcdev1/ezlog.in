/**
 * Represents an OIDC Client
 *
 * @interface
 */
export interface OidcClient {
  /**
   * A unique identifier for the client, assigned by the IDP
   *
   * @type {string}
   */
  client_id: string;

  /**
   * A secret value used by the client to authenticate itself to the IDP
   *
   * @type {string}
   */
  client_secret: string;

  /**
   * The URIs that the IDP will redirect users back to after they have authenticated with the IDP
   *
   * @type {string[]}
   */
  redirect_uris: string[];

  /**
   * The grant types that the client is allowed to use when obtaining an access token from the IDP
   *
   * @type {string[]}
   */
  grant_types: string[];

  /**
   * The response types that the client is allowed to use when requesting authorization from the IDP
   *
   * @type {string[]}
   */
  response_types: string[];

  /**
   * The authentication method that the client is required to use when authenticating itself to the IDP's token endpoint (e.g. client_secret_basic, client_secret_post, private_key_jwt, none)
   *
   * @type {string}
   */
  token_endpoint_auth_method: string;

  /**
   * The URI where the client's public keys can be retrieved in JWK format
   *
   * @type {string}
   */
  jwks_uri: string;
}
