import { EmailTemplate } from "@mewi/models";
import { createSmtpTransport, TransportConfig } from "./smtpTransport";
import { defaultTransportConfig } from "./configureSMTP";
import { getTestMessageUrl } from "nodemailer";
import { renderTemplate } from "../renderTemplate";

export type EmailConfig = {
  to: string;
  subject: string;
  locals: { clientUrl: string } & Record<any, any>;
};

export const validateEmailConfig = (emailConfig: EmailConfig) => {
  if (emailConfig.to == null)
    throw new Error(`emailConfig.to must be a valid email address`);
  if (emailConfig.subject == null)
    throw new Error(`emailConfig.subject must be a valid string`);
  if (emailConfig.locals == null || emailConfig.locals.clientUrl == null)
    throw new Error(
      `emailConfig.locals must be a non-null object and contain clientUrl`
    );
};

export const sendEmailTemplate = async (
  templateStr: EmailTemplate,
  emailConfig: EmailConfig,
  transportConfig: TransportConfig = defaultTransportConfig,
  templatesPath: string = undefined
): Promise<void> => {
  validateEmailConfig(emailConfig);
  const transport = await createSmtpTransport(transportConfig);

  const info = await transport.sendMail({
    from: transportConfig.username,
    to: emailConfig.to,
    subject: emailConfig.subject,
    ...renderTemplate(templateStr, emailConfig.locals, templatesPath),
  });

  if (process.env.NODE_ENV === "development") {
    console.log(`Development email preview: ${getTestMessageUrl(info)}`);
  }
};
