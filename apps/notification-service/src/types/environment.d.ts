declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MQ_CONNECTION_STRING?: string,
            MONGO_URI: string,
            NODE_ENV: 'development' | 'production'
        }
    }
}

export {}