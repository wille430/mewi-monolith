import { EmailTemplate } from "@mewi/models";
import { createSmtpTransport, TransportConfig } from "./smtpTransport";
import { defaultTransportConfig } from "./configureSMTP";
import { getTestMessageUrl } from "nodemailer";
import { renderTemplate } from "../renderTemplate";
import { validateEmailConfig } from "./validateEmailConfig";

export type EmailConfig = {
  to: string;
  subject: string;
  locals: { clientUrl: string; logoUrl: string } & Record<any, any>;
};

export const sendEmailTemplate = async (
  templateStr: EmailTemplate,
  emailConfig: EmailConfig,
  transportConfig: TransportConfig = defaultTransportConfig,
  templatesPath: string = undefined
): Promise<void> => {
  validateEmailConfig(emailConfig);
  const transport = await createSmtpTransport(transportConfig);

  console.log(
    `Rendering email with following locals: ${JSON.stringify(
      emailConfig.locals
    )}`
  );

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
