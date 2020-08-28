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
import { IdProvider, IdFactory } from "../entities/IdFactory";
import { nanoid } from "nanoid";

const container = createContainer();

container.register<IdProvider>(TYPES.IdProvider, asValue(nanoid));
container.register<IdFactory>(TYPES.IdFactory, asClass(IdFactory));
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
