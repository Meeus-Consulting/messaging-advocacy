import { Channel, Connection } from "amqplib";

import { ILog } from "../logging";
import pino from "pino";

export interface MessagingOptions {
  serviceName: string;
  rabbitConnectionString: string;
  logger?: ILog;
}

export abstract class MessagingBus {
  protected readonly logger: ILog;
  protected readonly serviceName: string;
  protected readonly rabbitConnectionString: string;

  protected connection: Connection | undefined;
  protected channel: Channel | undefined;
  protected constructor({ serviceName, logger, rabbitConnectionString }: MessagingOptions) {
    this.serviceName = serviceName.toLowerCase();
    this.rabbitConnectionString = rabbitConnectionString;
    this.logger = logger ?? pino();
  }

  abstract initialize(): Promise<void>;

  protected async assertExchange(name: string, boundTo?: string) {
    const assertedExchange = await this.channel?.assertExchange(name, "topic", { durable: true });
    if (assertedExchange) this.logger.debug({ action: "ASSERTED", type: "EXCHANGE", entity: name });
    if (boundTo) this.channel?.bindExchange(name, boundTo, "#");
    return assertedExchange;
  }

  protected async assertQueue(name: string, boundTo: string, forMessage: string = "#") {
    const existingQueue = await this.channel?.assertQueue(name, {
      exclusive: false,
      autoDelete: true,
      durable: false,
    });
    if (existingQueue) {
      this.logger.debug({ action: "ASSERTED", type: "QUEUE", entity: existingQueue.queue });
      await this.channel?.bindQueue(existingQueue.queue, boundTo, forMessage);
      this.logger.debug({
        action: "BOUND",
        from: { type: "QUEUE", entity: existingQueue.queue },
        to: { type: "EXCHANGE", entity: boundTo },
      });
    }
  }
}
