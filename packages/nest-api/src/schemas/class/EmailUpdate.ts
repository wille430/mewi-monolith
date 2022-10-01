import { Prop, Schema } from '@nestjs/mongoose'
import { IEmailUpdate } from '@wille430/common'

@Schema()
export class EmailUpdate implements IEmailUpdate {
    @Prop({
        type: String,
        required: true,
    })
    newEmail!: string

    @Prop({
        type: String,
        required: true,
    })
    tokenHash!: string

    @Prop({
        type: Date,
        required: true,
    })
    expiration!: Date
}
