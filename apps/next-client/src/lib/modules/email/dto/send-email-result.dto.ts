import {EmailTemplate} from "@mewi/models";

export class SendEmailResultDto<T> {
    emailRecordId?: string;
    template!: EmailTemplate;
    // TODO: make type safe
    arguments?: T;
}
