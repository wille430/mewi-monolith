declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URI: string
            TOKEN_KEY: string
            REFRESH_TOKEN_SECRET: string
            SEARCH_ENGINE_URL: string
            SEARCH_ENGINE_PORT: number
        }
    }
}

export {}
