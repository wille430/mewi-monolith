import {Role} from "@mewi/models";

export interface UserPayload {
    userId: string
    email: string
    roles: Role[]
}
