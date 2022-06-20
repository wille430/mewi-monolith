declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            TOKEN_KEY: string
            REFRESH_TOKEN_SECRET: string
            GOOGLE_CLIENT_ID: string
            GOOGLE_SECRET: string
            NODE_ENV: 'development' | 'production' | 'test' | 'provision'
        }
    }
}

export {}
