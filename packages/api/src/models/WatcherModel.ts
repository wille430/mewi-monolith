import { PublicWatcher } from '@mewi/types'
import { ObjectId } from 'bson'
import { models, Schema, model } from 'mongoose'

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


const WatcherSchema = new Schema<PublicWatcher>({
    query: { type: Object, unique: true },
    metadata: {
        keyword: { type: String },
        category: { type: String },
        regions: [String],
        isAuction: { type: Boolean },
        priceRange: {
            gte: { type: String },
            lte: { type: String }
        }
    },
    users: [
        { type: Schema.Types.ObjectId, ref: 'user' }
    ]
}, {
    timestamps: true
})

const WatcherModel = model<PublicWatcher>("watchers", WatcherSchema)

export default WatcherModel