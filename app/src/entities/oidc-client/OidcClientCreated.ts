import { DomainEvent } from "../DomainEvent";
import { OidcClient } from "./OidcClient";

export class OidcClientCreated extends DomainEvent<OidcClient> {}
