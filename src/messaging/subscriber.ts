import {MessagingBus, MessagingOptions} from "./messagingBus";
import amqp from "amqplib";
import { toExchangeNameFromServiceName } from "./factories/toExchangeNameFromServiceName";

interface SubscriptionOptions {
}

interface Subscription {
    toService: string,
    eventTypeName: string
}
export class Subscriber extends MessagingBus {
    readonly #inboundExchangeName: string
    #initialized: any;
    readonly #subscriptions: Map<string, Set<string>> = new Map<string, Set<string>>()
    readonly #serviceQueue: string;

    constructor(options: SubscriptionOptions & MessagingOptions) {
        super(options)
        this.#inboundExchangeName = `${this.serviceName}.events.inbound`
        this.#serviceQueue = `${this.serviceName}.inbox`
    }

    public async initialize() {
        if (this.#initialized) return
        this.logger.debug({action: 'INITIALISE', MODE: 'SUBSCRIBER', status: 'STARTING'})
        this.connection = await amqp.connect(this.rabbitConnectionString)
        this.channel = await this.connection.createChannel();

        const existingExchange = await this.assertExchange(this.#inboundExchangeName)
        if (!existingExchange) {
            throw new Error('What the hell');
        }

        await this.assertQueue(this.#serviceQueue, existingExchange.exchange)

        this.#initialized = true
        this.logger.info({action: 'INITIALISE',  MODE: 'SUBSCRIBER',status: 'COMPLETE'})
    }

    public async subscribe(serviceName: string, eventType: string) {
        // build up expected exchange name to subscribe to
        const allOfThem = ''
        const exchangeToSubscribeTo = toExchangeNameFromServiceName(serviceName);
        const routingKeysToConsider = allOfThem;
        await this.channel?.checkExchange(exchangeToSubscribeTo)
        await this.channel?.bindExchange(this.#inboundExchangeName, exchangeToSubscribeTo, routingKeysToConsider)
    }

    public async addSubscription(serviceName:string, eventType: string) {
        const currentSubscriptions = this.#subscriptions.get(serviceName) || new Set<string>();
        currentSubscriptions.add(eventType);
        this.#subscriptions.set(serviceName, currentSubscriptions)
    }
}
