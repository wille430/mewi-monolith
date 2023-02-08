declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URI: string
            SESSION_PASSWORD: string
            ADMIN_API_KEY?: string
            VERCEL_URL?: string
            MQ_CONNECTION_STRING: string
        }
    }

    interface Window {
        Cypress?: any
        store: Store
        axios?: Axios
    }
}

export {}
