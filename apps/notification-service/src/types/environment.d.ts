declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
