import { toFullyScopedEventTypeName } from "./factories/toFullyScopedEventTypeName";

export abstract class EventType {
  protected constructor(
    private readonly service: string,
    private readonly eventType: string,
    private readonly version: number
  ) {}

  get fullEventType(): string {
    return toFullyScopedEventTypeName(this.service, this.eventType, this.version.toString());
  }

  protected abstract toMessageProperties(): any;

  public toBuffer() {
    const message = this.toString();

    return Buffer.from(JSON.stringify(message));
  }

  public toString(): string {
    return {
      ...{ type: this.fullEventType },
      ...this.toMessageProperties(),
    };
  }
}
