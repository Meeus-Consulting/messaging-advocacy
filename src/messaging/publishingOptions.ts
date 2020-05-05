import {ILog} from '../logging/';

export interface PublishingOptions {
    serviceName: string,
    connectionDetails: {
        url: string
    },
    testing?: {
        createLocalQueue: boolean
    },
    logger?: ILog
}
