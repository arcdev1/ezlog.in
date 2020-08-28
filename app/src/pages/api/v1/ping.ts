import {
  HttpHandler,
  HttpRequestObject,
  ok,
} from "../../../infrastructure/HttpHandler";

const httpHandler = HttpHandler.for({ framework: "Next", controller: getPing });
export default httpHandler.handlerFn;
export const config = httpHandler.config;

async function getPing(_request: HttpRequestObject) {
  return ok({
    data: { message: "pong" },
    headers: {
      "content-type": "application/json",
    },
  });
}
