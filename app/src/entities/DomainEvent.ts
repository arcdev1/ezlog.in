export class DomainEvent<P> {
  #occurredAt: number;
  #payload: P;
  constructor(props: P) {
    this.#occurredAt = Date.now();
    this.#payload = props;
  }
  public getOccurredAt(): number {
    return this.#occurredAt;
  }
  public getPayload(): P {
    return this.#payload;
  }
}
