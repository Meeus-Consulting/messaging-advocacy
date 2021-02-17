import { Subscriber } from "../../messaging/subscriber";
import pino from "pino";
import repeat from "repeat";
import { v4 } from "uuid";

const debugLogger = pino({ level: "debug" });

const pinterestSubscriber = new Subscriber({
  serviceName: "pinterest",
  rabbitConnectionString: "amqp://guest:guest@localhost:5672",
  logger: debugLogger,
});

(async () => {
  await pinterestSubscriber.initialize();
  pinterestSubscriber.addSubscription("users", "user_invited");
  await pinterestSubscriber.createSubscriptions();
})();
