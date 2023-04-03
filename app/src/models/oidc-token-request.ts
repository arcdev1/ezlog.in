/**
 * Represents the parameters that can be sent in a request to exchange an authorization code for an access token.
 */
export interface OIDCTokenRequest {
  /** The grant type of the token request. This field must be set to "authorization_code". */
  grant_type: string;
  /** The authorization code obtained from the authorization endpoint. */
  code: string;
  /** The redirect URI that was used in the authorization request. */
  redirect_uri: string;
  /** The client ID of the client application. */
  client_id: string;
  /** The client secret of the client application. */
  client_secret?: string;
  /** The code verifier that was used in the authorization request. This field is required if a code_challenge was sent in the authorization request. */
  code_verifier?: string;
  /** The resource server that the access token is intended for. This field is optional. */
  resource?: string;
  /** The scope of the access token. This field is optional. */
  scope?: string;
}
