import { autoInjectable } from "tsyringe";
import { SendEmailResultDto } from "./dto/send-email-result.dto";
import { User } from "@mewi/entities";
import { EmailTemplate } from "@mewi/models";
import { EmailRecordModel } from "@/lib/modules/email/email-record.schema";
import { sendEmailTemplate } from "@mewi/email-templates/dist/src";

@autoInjectable()
export class EmailService {
  async sendEmail<T>(
    toUser: User,
    subject: string,
    locals: T,
    template: EmailTemplate
  ): Promise<SendEmailResultDto<T>> {
    const emailRecord = await EmailRecordModel.create({
      template,
      arguments: locals,
      user: toUser,
    });

    await sendEmailTemplate(
      template,
      {
        locals: locals,
        subject: subject,
        to: toUser.email,
      },
      {
        host: process.env.SMTP_HOST,
        secure: true,
        port: 465,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
      }
    );

    return {
      template,
      arguments: locals,
      emailRecordId: emailRecord.id,
    };
  }
}
