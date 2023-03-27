import {
  attribute,
  hashKey,
  table,
} from "@aws/dynamodb-data-mapper-annotations";
import { OidcClient } from "../OidcClient";
import { Version } from "../../common/Version";
import { OidcClientRedirects } from "../OidcClientRedirects";
import { OidcClientName } from "../OidcClientName";
import { Id } from "../../common/Id";

@table("OidcClient")
export class OidcClientModel {
  @hashKey()
  id: string;

  @attribute()
  name: string;

  @attribute()
  version: number;

  @attribute()
  redirects: string[];

  public static fromOidcClient(client: OidcClient) {
    let model = new OidcClientModel();
    model.id = client.id.toString();
    model.name = client.name.toString();
    model.version = client.version.value;
    model.redirects = client.redirects.toStringArray();
    return model;
  }

  public toOidcClient() {
    return OidcClient.of({
      id: Id.of(this.id),
      name: OidcClientName.of(this.name),
      version: Version.of(this.version),
      redirects: OidcClientRedirects.fromStringArray(this.redirects),
    });
  }
}
