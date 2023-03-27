import { createContainer, asClass, asValue } from "awilix";
import { httpClient } from "../common/infrastructure/HttpClient";
// import { OidcClientNameCollectionImpl } from "../infrastructure/OidcClientNameCollection";
import { NameRequestService } from "../services/NameRequestService";
import { TYPES } from "./types";

import {
  OidcClientNameCollection,
  OidcClientNameSelection,
} from "../use-cases/oidc-client/OidcClientNameSelection";
import { HttpClient } from "../services";
import { OidcClientModel } from "../oidc-clients/infrastructure/OidcClientModel";
import { nanoid } from "nanoid";
import { PrimitiveIdFn, IdProvider, IdProviderImpl } from "../common/Id";
import {
  PrimitiveVersionFn,
  VersionProvider,
  VersionProviderImpl,
} from "../common/Version";

const container = createContainer();

container.register<PrimitiveIdFn>(TYPES.PrimitiveIdFn, asValue(nanoid));
container.register<IdProvider>(
  TYPES.IdProvider,
  asClass(IdProviderImpl).singleton()
);
container.register<PrimitiveVersionFn>(
  TYPES.PrimitiveVersionFn,
  asValue(() => Date.now() + Math.random())
);
container.register<VersionProvider>(
  TYPES.VersionProvider,
  asClass(VersionProviderImpl).singleton()
);
container.register<IdProvider>(
  TYPES.IdProvider,
  asClass(IdProviderImpl).singleton()
);

// OidcClientNameCollection
// container.register<OidcClientNameCollection>(
//   TYPES.OidcClientNameCollection,
//   asClass(OidcClientNameCollectionImpl).singleton()
// );

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
