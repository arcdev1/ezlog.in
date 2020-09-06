import { createContainer, asClass, asValue } from "awilix";
import { httpClient } from "../infrastructure/HttpClient";
import { OidcClientNameCollectionImpl } from "../infrastructure/OidcClientNameCollection";
import { NameRequestService } from "../services/NameRequestService";
import { TYPES } from "./types";

import {
  OidcClientNameCollection,
  OidcClientNameSelection,
} from "../use-cases/oidc-client/OidcClientNameSelection";
import { HttpClient } from "../services";
import {
  OidcClientDAO,
  OidcClientModel,
} from "../infrastructure/OidcClientModel";
import { nanoid } from "nanoid";
import { IdStringProvider, IdProvider, IdProviderImpl } from "../common/Id";
import { VersionNumberProvider } from "../common/Version";

const container = createContainer();

container.register<IdStringProvider>(TYPES.IdStringProvider, asValue(nanoid));
container.register<IdProvider>(
  TYPES.IdProvider,
  asClass(IdProviderImpl).singleton()
);
container.register<VersionNumberProvider>(
  TYPES.VersionNumberProvider,
  asValue(() => Date.now() + Math.random())
);
container.register<IdProvider>(
  TYPES.IdProvider,
  asClass(IdProviderImpl).singleton()
);
container.register<OidcClientDAO>(
  TYPES.OidcClientDAO,
  asValue(OidcClientModel)
);

// OidcClientNameCollection
container.register<OidcClientNameCollection>(
  TYPES.OidcClientNameCollection,
  asClass(OidcClientNameCollectionImpl).singleton()
);

// OidcClientNameSelection
container.register<OidcClientNameSelection>(
  TYPES.OidcClientNameSelection,
  asClass(OidcClientNameSelection).singleton()
);

// HttpClient
container.register<HttpClient>(TYPES.HttpClient, asValue(httpClient));

// NameRequestService
container.register<NameRequestService>(
  TYPES.NameRequestService,
  asClass(NameRequestService).singleton()
);

export { container, TYPES };
