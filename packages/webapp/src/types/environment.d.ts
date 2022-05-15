import { PrismaClient } from '@mewi/prisma'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            SESSION_PASSWORD: string
            NEXT_PUBLIC_API_URL: string
            JWT_SECRET_KEY?: string
        }

        interface global {
            prisma?: typeof PrismaClient
        }
    }
}

export {}
