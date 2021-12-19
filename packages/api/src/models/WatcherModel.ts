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

export interface PublicWatcher {
    _id: ObjectId,
    query: any,
    metadata: {
        keyword: string,
        category?: string,
        regions?: string[],
        isAuction?: boolean,
        priceRange?: {
            gte: string,
            lte: string
        }
    },
    users: ObjectId[],
    createdAt: string
}

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