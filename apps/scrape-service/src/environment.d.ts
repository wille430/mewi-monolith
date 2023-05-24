declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      NODE_ENV: "development" | "production";
      MONGO_URI: string;
    }
  }
}

export {};
