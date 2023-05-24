// noinspection JSUnusedGlobalSymbols

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      SESSION_PASSWORD: string;
      ADMIN_API_KEY?: string;
      NEXT_PUBLIC_URL: string;
      MQ_CONNECTION_STRING: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      SMTP_HOST: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
    }
  }

  interface Window {
    Cypress?: any;
    store: Store;
    axios?: Axios;
  }
}

export {};
