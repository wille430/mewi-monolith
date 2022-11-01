import type { Role } from '@/common/schemas'

export interface UserPayload {
    userId: string
    email: string
    roles: Role[]
}
