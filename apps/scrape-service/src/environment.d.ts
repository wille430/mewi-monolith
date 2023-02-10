declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MQ_CONNECTION_STRING?: string,
            NODE_ENV: 'development' | 'production',
            MONGO_URI: string
        }
    }
}

export {}