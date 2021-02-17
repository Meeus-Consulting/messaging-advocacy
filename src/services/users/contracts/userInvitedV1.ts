import { EventType } from "../../../messaging/eventType";

export class UserInvitedV1 extends EventType {
  constructor(
    private readonly userIdentifier: string,
    private readonly companyIdentifier: string,
    private readonly invitationIdentifier: string
  ) {
    super("users", "user_invited", 1);
  }

  protected toMessageProperties() {
    return {
      user_id: this.userIdentifier,
      company_id: this.companyIdentifier,
      invitation_id: this.invitationIdentifier,
    };
  }
}
