import {
  makeHttpHandler,
  HttpRequestObject,
  HttpResponseObject,
  created,
  methodNotAllowed,
  unsupportedMediaType,
} from "../../../../infrastructure/http-handler";

const { handler, config } = makeHttpHandler(handleClientRequest);
export default handler;
export { config };

function handleClientRequest(
  request: HttpRequestObject
): Readonly<HttpResponseObject> {
  if (request.method === "POST") {
    const accept = ["application/json", "application/x-www-form-urlencoded"];
    if (!accept.includes(request.headers["content-type"])) {
      return unsupportedMediaType({ accept });
    }
    return postClient(request);
  }
  return methodNotAllowed({ allow: "POST" });
}

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
