import { EmailTemplate } from "@mewi/models";
import { getEmailTemplate } from "../getEmailTemplate";
import { createSmtpTransport, TransportConfig } from "./smtpTransport";
import * as nodeMailer from "nodemailer";
import { defaultTransportConfig } from "./configureSMTP";

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
  transportConfig: TransportConfig = defaultTransportConfig
): Promise<void> => {
  validateEmailConfig(emailConfig);

  const template = getEmailTemplate(templateStr);
  const transport = await createSmtpTransport(transportConfig);

  const info = await transport.sendMail({
    from: transportConfig.username,
    to: emailConfig.to,
    subject: emailConfig.subject,
    html: template(emailConfig.locals).html,
  });

  if (process.env.NODE_ENV === "development") {
    console.log(
      `Development email preview: ${nodeMailer.getTestMessageUrl(info)}`
    );
  }
};
