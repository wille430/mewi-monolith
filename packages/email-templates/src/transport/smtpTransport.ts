import * as nodeMailer from "nodemailer";
import { validateTransportConfig } from "./validateTransportConfig";
import { defaultTransportConfig } from "./configureSMTP";

export type TransportConfig = {
  host: string;
  port: number;
  secure: boolean;
  username?: string;
  password?: string;
};

export const createSmtpTransport = async (
  transportConfig: TransportConfig = null,
  testAccount = process.env.NODE_ENV !== "production"
) => {
  // noinspection AssignmentToFunctionParameterJS
  transportConfig ??= defaultTransportConfig;
  validateTransportConfig(transportConfig);

  if (testAccount) {
    const account = await nodeMailer.createTestAccount();
    return nodeMailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  return nodeMailer.createTransport({
    host: transportConfig.host,
    port: transportConfig.port,
    secure: transportConfig.secure,
    auth: {
      user: transportConfig.username,
      pass: transportConfig.password,
    },
  });
};
