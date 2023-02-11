// noinspection JSUnusedGlobalSymbols,ES6UnusedImports
// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import * as IronSession from '@/lib/types/iron-session'
import type {UserPayload} from '@/lib/modules/common/types/UserPayload'

declare module 'iron-session' {
    interface IronSessionData {
        user?: UserPayload
    }
}
