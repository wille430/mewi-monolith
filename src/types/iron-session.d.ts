import * as IronSession from 'iron-session'
import type { UserPayload } from '@/backend/modules/common/types/UserPayload'

declare module 'iron-session' {
    interface IronSessionData {
        user?: UserPayload
    }
}
