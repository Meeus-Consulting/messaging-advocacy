import amqp, {Channel, Connection} from "amqplib";
import pino from 'pino'
import {SmartlyEvent} from "./smartlyEvent";
import {PublishingOptions} from "./publishingOptions";
import {ILog} from "../logging";

export class PublishingBus {
    #initialized: boolean = false;
    #connection: Connection | undefined;
    #channel: Channel | undefined;
    readonly #outboundExchangeName: string;
    readonly #url: string;
    readonly #logger: ILog

    readonly #createTestQueue: boolean = false;

    constructor({
                    serviceName,
                    connectionDetails,
                    testing,
                    logger}: PublishingOptions) {
        this.#url = connectionDetails.url;
        this.#outboundExchangeName = `${serviceName.toLowerCase()}.events.outbound`
        if (testing) {
            this.#createTestQueue = testing.createLocalQueue;
        }
        this.#logger = logger ?? pino();
    }

    public async initialize() {
        if (this.#initialized) return;

        this.#connection = await amqp.connect(this.#url)
        this.#channel = await this.#connection.createChannel();

        // assert exchange exists
        const existingExchange = await this.assertExchange(this.#outboundExchangeName)

        if (existingExchange && this.#createTestQueue) {
            await this.assertQueue('test-queue', existingExchange.exchange)
        }
        this.#initialized = true
    }

    public async publish(message: SmartlyEvent) {
        await this.initialize()
        this.#channel?.publish(this.#outboundExchangeName, message.fullEventType, message.toBuffer(), {deliveryMode: true})
        this.#logger.info({action: 'PUBLISH', event: message.fullEventType})
    }

    private async assertExchange(name: string) {
        const assertedExchange = await this.#channel?.assertExchange(name, 'topic', {durable: true})
        if (assertedExchange) this.#logger.debug({action: 'ASSERTED', type: 'EXCHANGE', entity: name})
        return assertedExchange
    }

    private async assertQueue(name: string, boundTo: string) {
        const existingQueue = await this.#channel?.assertQueue(name, {
            exclusive: true,
            autoDelete: true,
            durable: false
        });
        if (existingQueue) {
            this.#logger.debug({action: 'ASSERTED', 'type': 'QUEUE', entity: existingQueue.queue})
            await this.#channel?.bindQueue(existingQueue.queue, boundTo, '');
            this.#logger.debug({
                action: 'BOUND',
                from: {type: 'QUEUE', entity: existingQueue.queue},
                to: {type: 'EXCHANGE', entity: boundTo}
            });
        }

    }
}
