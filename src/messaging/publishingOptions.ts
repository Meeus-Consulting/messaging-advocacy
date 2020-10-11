import {ILog} from '../logging/';

export interface PublishingOptions {
    testing?: {
        createLocalQueue: boolean
    },
}
