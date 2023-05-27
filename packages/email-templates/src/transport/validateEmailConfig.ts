import { EmailConfig } from "./sendEmailTemplate";
import { validateLocals } from "./validateLocals";

export const validateEmailConfig = (emailConfig: EmailConfig) => {
  if (emailConfig.to == null)
    throw new Error(`emailConfig.to must be a valid email address`);
  if (emailConfig.subject == null)
    throw new Error(`emailConfig.subject must be a valid string`);
  if (emailConfig.locals == null)
    throw new Error(
      `emailConfig.locals must be a non-null object and contain clientUrl`
    );

  validateLocals(emailConfig.locals);
};
