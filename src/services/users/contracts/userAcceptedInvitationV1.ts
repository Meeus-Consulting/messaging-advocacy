import { EventType } from "../../../messaging/eventType";

export class UserAcceptedInvitationV1 extends EventType {
  constructor(
    private readonly userIdentifier: string,
    private readonly companyIdentifier: string,
    private readonly invitationId: string
  ) {
    super("users", "user_accepted_invitation", 1);
  }

  protected toMessageProperties() {
    return {
      user_id: this.userIdentifier,
      company_id: this.companyIdentifier,
      invitation_id: this.invitationId,
    };
  }
}
