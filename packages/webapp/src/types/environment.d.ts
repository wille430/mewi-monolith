declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            SESSION_PASSWORD: string
            NEXT_PUBLIC_API_URL: string
        }
    }
}

export {}
