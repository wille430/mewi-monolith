import { PublicWatcher } from '@mewi/types'
import { ObjectId } from 'bson'
import { models, Schema, model } from 'mongoose'
import { SearchFilterDataProps } from '@mewi/types'

// export interface WatcherQuery {
//     bool: {
//         must: [
//             {
//                 match: {
//                     title: string,
//                     [key: string]: any
//                 }
//             },
//             {
//                 range?: { date: { gte: number } }
//             }
//         ]
//     }
// }

const WatcherSchema = new Schema<PublicWatcher>(
    {
        query: { type: Object, unique: true },
        metadata: {
            type: Object,
            default: {
                keyword: '',
            },
        },
        users: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    },
    {
        timestamps: true,
    }
)

const WatcherModel = model<PublicWatcher>('watchers', WatcherSchema)

export default WatcherModel
