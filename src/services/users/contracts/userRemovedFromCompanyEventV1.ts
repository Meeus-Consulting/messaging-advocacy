import { EventType } from "../../../messaging/eventType";

export class UserRemovedFromCompanyEventV1 extends EventType {
  constructor(private readonly userIdentifier: string, private readonly companyIdentifier: string) {
    super("users", "user_removed", 1);
  }

  protected toMessageProperties() {
    return {
      user_id: this.userIdentifier,
      company_id: this.companyIdentifier,
    };
  }
}
