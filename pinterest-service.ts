import pino from "pino";
import repeat from "repeat";

import { v4 } from "uuid";

import { Publisher } from "./src/messaging/publisher";
import { Subscriber } from "./src/messaging/subscriber";
import { UserInvitedEventV1 } from "./src/users/contracts/userInvitedEventV1";

const debugLogger = pino({ level: "debug" });
const pinterestSubscriber = new Subscriber({
  serviceName: "pinterest",
  rabbitConnectionString: "amqp://guest:guest@localhost:5672",
  logger: debugLogger,
});

(async () => {
  await pinterestSubscriber.initialize();
  await pinterestSubscriber.subscribe('users', 'user_invited')
})();
