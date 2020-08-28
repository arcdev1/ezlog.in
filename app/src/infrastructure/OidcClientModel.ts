import { DbDocument, dbClient } from "./DbClient";

export interface OidcClientDocument extends DbDocument {
  clientName: string;
  id: string;
}

export const OidcClientModel = dbClient.model<OidcClientDocument>(
  "OidcClient",
  {
    clientName: String,
    id: String,
  }
);

export type OidcClientDAO = typeof OidcClientModel;
