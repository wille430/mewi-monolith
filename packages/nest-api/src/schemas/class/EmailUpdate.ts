import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class EmailUpdate {
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
