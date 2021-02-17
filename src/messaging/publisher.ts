import { MessagingBus, MessagingOptions } from "./messagingBus";
import amqp, { Channel, Connection } from "amqplib";

import { EventType } from "./eventType";
import { PublishingOptions } from "./publishingOptions";
import { toExchangeNameFromServiceName } from "./factories/toExchangeNameFromServiceName";

export class Publisher extends MessagingBus {
  #initialized: boolean = false;

  readonly #outboundExchangeName: string;
  readonly #createTestQueue: boolean;

  constructor(options: PublishingOptions & MessagingOptions) {
    super(options);
    this.#outboundExchangeName = toExchangeNameFromServiceName(this.serviceName);
    this.#createTestQueue = options.testing?.createLocalQueue ?? false;
  }

  public async initialize() {
    if (this.#initialized) return;
    this.logger.debug({
      action: "INITIALISE",
      MODE: "PUBLISHER",
      status: "STARTING",
    });
    this.connection = await amqp.connect(this.rabbitConnectionString);
    this.channel = await this.connection.createChannel();

    const existingExchange = await this.assertExchange(this.#outboundExchangeName);

    if (existingExchange && this.#createTestQueue) {
      await this.assertQueue(`${this.serviceName}:test-queue`, existingExchange.exchange);
    }
    this.#initialized = true;
    this.logger.info({
      action: "INITIALISE",
      MODE: "PUBLISHER",
      status: "COMPLETE",
    });
  }

  public async publish(message: EventType) {
    await this.initialize();
    this.channel?.publish(this.#outboundExchangeName, message.fullEventType, Buffer.from(message.toBuffer()));
    this.logger.info({ action: "PUBLISH", event: message.fullEventType });
  }
}
