import {
  // makeHttpHandler,
  HttpRequestObject,
  HttpResponseObject,
  created,
  methodNotAllowed,
  unsupportedMediaType,
} from "../../../../common/infrastructure/HttpHandler";

function postClient(request: HttpRequestObject): Readonly<HttpResponseObject> {
  return created({
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      id: "123",
      secret: "abc",
    },
  });
}

export interface PostClientRequest {
  client_id: string;
}
