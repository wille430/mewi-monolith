import { IUser } from './IUser'
import { IWatcher } from './IWatcher'

export interface IUserWatcher {
    id: string
    watcher: IWatcher
    user: IUser
    notifiedAt?: Date
}
