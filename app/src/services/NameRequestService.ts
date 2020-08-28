import { HttpClient } from "./";
import { Result } from "../entities/Result";
import { RequestedName } from "../entities/RequestedName";
import { OidcClientName } from "../entities/oidc-client/OidcClientName";

export class NameRequestService {
  #httpClient: HttpClient;
  constructor({ httpClient }: { httpClient: HttpClient }) {
    this.#httpClient = httpClient;
  }

  public async requestName(name: string): Promise<Result<RequestedName>> {
    const invalidName = OidcClientName.validate(name);
    if (invalidName) {
      return Result.fail([invalidName]);
    }
    const nameResponse = await this.#httpClient.get(
      `http://localhost:3000/api/v1/oidc-client-name/${name}`
    );
    if (nameResponse.errors) {
      return Result.fail(nameResponse.errors);
    }
    const response = nameResponse.value;
    let {
      data: requestedName,
    }: { data: RequestedName } = await response.json();

    return Result.succeed(requestedName);
  }
}
