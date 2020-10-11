import pino from "pino";
import repeat from "repeat";

import { v4 } from "uuid";

import { Publisher } from "./src/messaging/publisher";
import { UserInvitedEventV1 } from "./src/users/contracts/userInvitedEventV1";

const debugLogger = pino({ level: "debug" });
const usersMessageBus = new Publisher({
  serviceName: "users",
  rabbitConnectionString: "amqp://guest:guest@localhost:5672",
  logger: debugLogger,
});

(async () => {
  await usersMessageBus.initialize();

  repeat().do(async () => {
    const userId = v4();
    const companyId = v4();

    const messageToPublish = new UserInvitedEventV1(userId, companyId);

    await usersMessageBus.publish(messageToPublish);
  }).every(5_000);

})();
