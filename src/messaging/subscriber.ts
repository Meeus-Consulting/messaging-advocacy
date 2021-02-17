import { MessagingBus, MessagingOptions } from "./messagingBus";
import { toExchangeNameFromServiceName, toFullyScopedEventTypeName } from "./factories/";

import amqp from "amqplib";

interface SubscriptionOptions {}

interface Subscription {
  toService: string;
  eventTypeName: string;
}
export class Subscriber extends MessagingBus {
  #initialized: boolean = false;

  readonly #inboundExchangeName: string;
  readonly #subscriptions: Map<string, Set<string>> = new Map<string, Set<string>>();

  constructor(options: SubscriptionOptions & MessagingOptions) {
    super(options);
    this.#inboundExchangeName = `${this.serviceName}:events:inbound`;
  }

  public async initialize() {
    if (this.#initialized) return;
    this.logger.debug({
      action: "INITIALISE",
      MODE: "SUBSCRIBER",
      status: "STARTING",
    });
    this.connection = await amqp.connect(this.rabbitConnectionString);
    this.channel = await this.connection.createChannel();

    const existingExchange = await this.assertExchange(this.#inboundExchangeName);
    if (!existingExchange) {
      throw new Error("What the hell");
    }

    this.#initialized = true;
    this.logger.info({
      action: "INITIALISE",
      MODE: "SUBSCRIBER",
      status: "COMPLETE",
    });
  }

  public async createSubscriptions() {
    for (const [serviceName, eventTypes] of this.#subscriptions) {
      const exchangeToSubscribeTo = toExchangeNameFromServiceName(serviceName);
      // TODO: Make this version gnostic
      const listOfUniqueRoutingKeys = [...eventTypes].map((eventType) =>
        toFullyScopedEventTypeName(serviceName, eventType)
      );
      this.logger.warn({ action: "SUBSCRIBE", to: serviceName });
      await this.assertExchange(this.#inboundExchangeName, exchangeToSubscribeTo);
      listOfUniqueRoutingKeys.forEach(async (routingKey) => {
        await this.assertQueue(`${this.#inboundExchangeName}:${routingKey}`, this.#inboundExchangeName, routingKey);
      });
      await this.channel?.bindExchange(this.#inboundExchangeName, exchangeToSubscribeTo, "#");
    }
  }

  public async addSubscription(serviceName: string, eventType: string) {
    const currentSubscriptions = this.#subscriptions.get(serviceName) || new Set<string>();
    currentSubscriptions.add(eventType);
    this.#subscriptions.set(serviceName, currentSubscriptions);
  }
}
