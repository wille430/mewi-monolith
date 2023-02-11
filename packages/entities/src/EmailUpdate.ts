import {prop} from '@typegoose/typegoose'

export class EmailUpdate {
    @prop({
        type: String,
        required: true,
    })
    newEmail!: string

    @prop({
        type: String,
        required: true,
    })
    tokenHash!: string

    @prop({
        type: Date,
        required: true,
    })
    expiration!: Date
}
