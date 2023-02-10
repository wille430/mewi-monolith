import {autoInjectable, inject} from 'tsyringe'
import {SendEmailResultDto} from './dto/send-email-result.dto'
import {EmailRecordsRepository} from './email-records.repository'
import {User} from '../schemas/user.schema'
import {EmailTemplate} from "@mewi/models"
import {MQQueues, SendEmailDto, MessageBroker} from "@mewi/mqlib"

@autoInjectable()
export class EmailService {

    private readonly messageBroker: MessageBroker

    constructor(
        @inject(EmailRecordsRepository)
        private readonly emailRecordsRepository: EmailRecordsRepository,
    ) {
        this.messageBroker = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    }

    async sendEmail<T>(
        toUser: User,
        subject: string,
        locals: T,
        template: EmailTemplate,
    ): Promise<SendEmailResultDto<T>> {

        const emailRecord = await this.emailRecordsRepository.create({
            template,
            arguments: locals,
            user: toUser,
        })

        // send message to MQ
        const msg: SendEmailDto = {
            emailTemplate: template,
            userEmail: toUser.email,
            subject: subject,
            userId: toUser.id,
            locals: locals
        }
        await this.messageBroker.sendMessage(MQQueues.SendEmail, msg)

        return {
            template,
            arguments: locals,
            emailRecordId: emailRecord.id,
        }
    }
}
