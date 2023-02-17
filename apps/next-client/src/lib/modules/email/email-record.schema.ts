import {getModelForClass, prop} from '@typegoose/typegoose'
import mongoose from 'mongoose'
import {EmailTemplate} from '@mewi/models'
import {User} from '@mewi/entities'

export class EmailRecord {
    id!: string

    @prop({
        type: String,
        enum: EmailTemplate,
        required: true,
    })
    template!: EmailTemplate

    @prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
    })
    user!: User

    @prop()
    arguments?: any
}

export const EmailRecordModel = getModelForClass(EmailRecord, {
    schemaOptions: {
        id: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
    },
})
