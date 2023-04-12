import { createLogger, format, transports } from "winston";

const { combine, label, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const createClassLogger = (className: string) => {
  return createLogger({
    format: combine(label({ label: className }), timestamp(), myFormat),
    transports: [new transports.Console()],
  });
};