import {
  HttpHandler,
  HttpRequestObject,
  ok,
  badRequest,
  methodNotAllowed,
} from "../../../../infrastructure/HttpHandler";
import { container, TYPES } from "../../../../ioc";
import { OidcClientNameSelection } from "../../../../use-cases/oidc-client/OidcClientNameSelection";

const httpHandler = HttpHandler.for({
  framework: "Next",
  controller: handleNameRequest,
});
export default httpHandler.handlerFn;
export const config = httpHandler.config;

async function handleNameRequest(request: HttpRequestObject) {
  return request.method === "GET"
    ? getNameRequest(request)
    : methodNotAllowed({ allow: ["GET", "OPTIONS"] });
}

async function getNameRequest(request: HttpRequestObject) {
  const nameSelection = container.resolve<OidcClientNameSelection>(
    TYPES.OidcClientNameSelection
  );
  const nameSelectionResult = await nameSelection.execute(request.params?.name);
  if (nameSelectionResult.errors) {
    const error = nameSelectionResult.errors[0];
    if (error.name === "MissingNameError") {
      return badRequest({ ...error, code: error.name });
    }
    throw error;
  }

  return ok({
    data: nameSelectionResult.value,
    headers: {
      "content-type": "application/json",
    },
  });
}
