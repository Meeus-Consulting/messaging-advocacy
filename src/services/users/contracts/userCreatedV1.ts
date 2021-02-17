import { EventType } from "../../../messaging/eventType";

export class UserCreatedV1 extends EventType {
  constructor(private readonly userIdentifier: string) {
    super("users", "user_created", 1);
  }

  protected toMessageProperties() {
    return {
      user_id: this.userIdentifier,
    };
  }
}
