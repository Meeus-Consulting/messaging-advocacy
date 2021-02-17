import { EventType } from "../../../messaging/eventType";

export class UserDeactivated extends EventType {
  constructor(private readonly userIdentifier: string) {
    super("users", "user_deactivated", 1);
  }

  protected toMessageProperties() {
    return {
      user_id: this.userIdentifier,
    };
  }
}
