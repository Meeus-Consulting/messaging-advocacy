// IMPORTS
import {PublishingBus} from "./src/messaging/publishingBus";
import pino from 'pino';
import {UserInvitedEventV1} from "./src/users/contracts/userInvitedEventV1";
import {v4} from "uuid";
(async () => {

    const debugLogger = pino({level: "debug"})
    const bus = new PublishingBus({
        serviceName: 'users',
        connectionDetails: {url: 'amqp://users_admin:users_admin@localhost:5672'},
        testing: {createLocalQueue: true},
        logger: debugLogger
    })

    await bus.initialize();
    const userId = v4()
    const companyId = v4()

    const messageToPublish = new UserInvitedEventV1(userId, companyId)

    await bus.publish(messageToPublish);

    // SUBSCRIBER 1
    //  SETUP

    //SUBSCRIBER 2
    //  SETUP
})()
