import { UserData, UserWatcherData } from '@mewi/types'
import { v4 as uuidv4 } from 'uuid'
import * as mongoose from 'mongoose'

export interface Watcher extends mongoose.Types.Subdocument, Omit<UserWatcherData, '_id'> {
    _id: mongoose.Types.ObjectId
}

export type User = mongoose.Document &
    Omit<UserData, 'watchers'> & {
        watchers: mongoose.Types.DocumentArray<Watcher>
    }

const WatcherSchema = new mongoose.Schema<Watcher>(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'watcher' },
        notifiedAt: { type: String, default: null },
    },
    {
        timestamps: true,
    }
)

const UserSchema = new mongoose.Schema<User>({
    email: { type: String, unique: true },
    password: { type: String },
    premium: { type: Boolean, default: false },
    watchers: [WatcherSchema],
    passwordResetSecret: { type: String, default: uuidv4() },
})

const UserModel = mongoose.model<User>('users', UserSchema)

export default UserModel
