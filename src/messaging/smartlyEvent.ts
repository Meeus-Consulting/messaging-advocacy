export abstract class SmartlyEvent {
    protected constructor(
        private readonly domain: string,
        private readonly eventType: string,
        private readonly version: number) {
    }

    get fullEventType(): string {
        return `${this.domain.toLowerCase()}.${this.eventType.toLowerCase()}.v${this.version.toString()}`
    }

    protected abstract getMessagingSubset(): any;

    public toBuffer() {
        const message = this.toString()

        return Buffer.from(JSON.stringify(message))
    }

    public toString():string {
        return {
        ...{type: this.fullEventType},
        ...this.getMessagingSubset()
        }
    }
}
