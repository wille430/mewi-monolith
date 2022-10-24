
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URI: string
            SESSION_PASSWORD: string
            NEXT_PUBLIC_API_URL: string
            JWT_SECRET_KEY?: string
            REFRESH_TOKEN_SECRET?: string
        }
    }
}

export {}
