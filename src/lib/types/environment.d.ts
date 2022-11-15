declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URI: string
            SESSION_PASSWORD: string
            ADMIN_API_KEY?: string
            CLIENT_URL?: string
        }
    }

    interface Window {
        Cypress?: any
        store: Store
        axios?: Axios
    }
}

export {}
