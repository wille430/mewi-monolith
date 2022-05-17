/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ironSession from 'iron-session'

declare module 'iron-session' {
    interface IronSessionData {
        user: {
            id: string
            roles: Role[]
        }
    }
}
