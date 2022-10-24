// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import * as NextAuth from 'next-auth'
import type { Role } from '@wille430/common'
import type { UserPayload } from '@/backend/modules/common/types/UserPayload'

declare module 'next-auth' {
    interface Session {
        user?: {
            roles: Role[]
        } & UserPayload
    }

    interface NextAuthOptions {
        callbacks: {
            registration: any
        }
    }
}
