declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MQ_CONNECTION_STRING?: string;
      MONGO_URI: string;
      NODE_ENV: "development" | "production";
      SMTP_HOST: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
      CLIENT_URL: string;
    }
  }
}

export {};
