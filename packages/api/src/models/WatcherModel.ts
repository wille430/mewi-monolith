import { PublicWatcher } from '@mewi/types'
import { Schema, model } from 'mongoose'

const WatcherSchema = new Schema<PublicWatcher>(
    {
        metadata: {
            type: Object,
            default: {
                keyword: '',
            },
            required: true,
            unique: true,
        },
        users: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    },
    {
        timestamps: true,
    }
)

const WatcherModel = model<PublicWatcher>('watchers', WatcherSchema)

export default WatcherModel
