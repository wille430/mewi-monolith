import type { Role } from '@wille430/common'

export interface UserPayload {
    userId: string
    email: string
    roles: Role[]
}
