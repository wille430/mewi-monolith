import { Prop, Schema } from '@nestjs/mongoose'
import { IPasswordReset } from '@wille430/common'

@Schema()
export class PasswordReset implements IPasswordReset {
    @Prop(String)
    tokenHash!: string

    @Prop(Number)
    expiration!: number
}
