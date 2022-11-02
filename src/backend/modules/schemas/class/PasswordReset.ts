import { prop } from '@typegoose/typegoose'

export class PasswordReset {
    @prop()
    expiration!: number

    @prop()
    tokenHash!: string
}
