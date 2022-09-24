import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class PasswordReset {
    @Prop(String)
    tokenHash!: string

    @Prop(Number)
    expiration!: number
}
