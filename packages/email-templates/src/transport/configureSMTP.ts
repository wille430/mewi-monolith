import { TransportConfig } from "./smtpTransport";
import { validateTransportConfig } from "./validateTransportConfig";

export let defaultTransportConfig: TransportConfig | null;

export const configureSMTP = (config: TransportConfig) => {
  validateTransportConfig(config);
  defaultTransportConfig = config;
};
