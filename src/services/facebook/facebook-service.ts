import { Subscriber } from "../../messaging/subscriber";
import pino from "pino";
import repeat from "repeat";
import { v4 } from "uuid";

const debugLogger = pino({ level: "debug" });

const facebookSubscriber = new Subscriber({
  serviceName: "facebook",
  rabbitConnectionString: "amqp://guest:guest@localhost:5672",
  logger: debugLogger,
});

(async () => {
  await facebookSubscriber.initialize();
  facebookSubscriber.addSubscription("users", "user_invited");
  facebookSubscriber.addSubscription("users", "user_deactivated");
  await facebookSubscriber.createSubscriptions();
})();
