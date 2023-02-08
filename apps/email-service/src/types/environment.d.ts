declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MQ_CONNECTION_STRING?: string,
            SMTP_USERNAME: string
            SMTP_PASSWORD: string,
            SMTP_HOST: string,
            NODE_ENV: 'development' | 'production'
        }
    }
}

export {}