import * as mongoose from 'mongoose'

export interface Watcher extends mongoose.Types.Subdocument {
    _id: mongoose.Types.ObjectId
    notifiedAt: Date | null
    createdAt: string
    updatedAt: string
}

export interface User extends mongoose.Document {
    email: string
    password: string
    premium: boolean
    watchers: mongoose.Types.DocumentArray<Watcher>
}

const WatcherSchema = new mongoose.Schema<Watcher>(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'watcher' },
        notifiedAt: { type: Date, default: null },
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
})

const UserModel = mongoose.model<User>('users', UserSchema)

export default UserModel
