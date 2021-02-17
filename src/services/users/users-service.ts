import { UserAcceptedInvitationV1, UserInvitedV1 } from "./contracts/";

import { Publisher } from "../../messaging/publisher";
import { UserCreatedV1 } from "./contracts/userCreatedV1";
import { UserDeactivated } from "./contracts/userDeactivatedV1";
import bodyParser from "body-parser";
import express from "express";
import { v4 as newIdentifier } from "uuid";
import pino from "pino";

const debugLogger = pino({ level: "info" });
const bus = new Publisher({
  serviceName: "users",
  rabbitConnectionString: "amqp://guest:guest@localhost:5672",
  logger: debugLogger,
});

const app = express();
app.use(bodyParser.json());
const PORT = 5000;

(async function main() {
  try {
    await bus.initialize();
    app.post("/invitations", async (req, res) => {
      const { user_id: userId, company_id: companyId } = req.body;
      const createdInvitation = newIdentifier();
      const userInvited = new UserInvitedV1(userId, companyId, createdInvitation);

      await bus.publish(userInvited);

      debugLogger.debug({ action: "HTTP", route: "INVITATIONS", method: "POST" });
      res.json({ user_id: userId, company_id: companyId, invitation_id: createdInvitation });
    });

    app.post("/invitations/:id/acceptances", async (req, res) => {
      const userId = req.body.user_id;
      const companyId = req.body.company_id;
      const invitationToAccept = req.params.id;

      const userAcceptedInvitation = new UserAcceptedInvitationV1(userId, companyId, invitationToAccept);
      await bus.publish(userAcceptedInvitation);
      const userCreated = new UserCreatedV1(userId);
      await bus.publish(userCreated);
      res.json({ user_id: userId, company_id: companyId, invitation_id: invitationToAccept });
    });

    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;

      await bus.publish(new UserDeactivated(userId));
    });

    app.get("/ping", (req, res) => res.json({ data: "pong" }));

    app.listen(PORT, () => {
      debugLogger.info({
        action: "INITIALISE",
        MODE: "SERVER",
        status: "COMPLETE",
        port: PORT,
      });
    });
  } catch (err) {
    debugLogger.fatal(err);
  }
})();
