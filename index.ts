// IMPORTS
import {PublishingBus} from "./src/messaging/publishingBus";
import pino from 'pino';
(async () => {

    const debugLogger = pino({level: "debug"})
    const bus = new PublishingBus({
        serviceName: 'users',
        connectionDetails: {url: 'amqp://users_admin:users_admin@localhost:5672'},
        testing: {createLocalQueue: true},
        logger: debugLogger
    })

    await bus.initialize();


    // SUBSCRIBER 1
    //  SETUP

    //SUBSCRIBER 2
    //  SETUP
})()
