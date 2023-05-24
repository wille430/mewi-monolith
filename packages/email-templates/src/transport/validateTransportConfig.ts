import { TransportConfig } from "./smtpTransport";

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
