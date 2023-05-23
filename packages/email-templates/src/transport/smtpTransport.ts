import * as nodeMailer from "nodemailer";

export type TransportConfig = {
  host: string;
  port: number;
  secure: boolean;
  username?: string;
  password?: string;
};

export const validateTransportConfig = (transportConfig: TransportConfig) => {
  if (transportConfig.host == null)
    throw new Error(
      `transportConfig.host must be a valid SMTP host domain name`
    );
  if (transportConfig.port == null)
    throw new Error(`transportConfig.port must be a valid number`);
  if (transportConfig.secure == null)
    throw new Error(`transportConfig.secure must be a valid boolean`);
};

export const createSmtpTransport = async (
  transportConfig: TransportConfig,
  testAccount = process.env.NODE_ENV !== "production"
) => {
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
