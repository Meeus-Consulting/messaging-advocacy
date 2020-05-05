import {SmartlyEvent} from "../../messaging/smartlyEvent";

class UserInvitedEventV1 extends SmartlyEvent {
    constructor(
        private readonly userIdentifier: string,
        private readonly companyIdentifier: string
    ) {
        super('users', 'user_invited', 1);
    }

    protected getMessagingSubset() {
        return {
            user_id: this.userIdentifier,
            company_id: this.companyIdentifier
        };
    }
}
