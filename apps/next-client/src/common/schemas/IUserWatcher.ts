import { IEntity } from './IEntity'
import { IUser } from './IUser'
import { IWatcher } from './IWatcher'

export interface IUserWatcher extends IEntity {
    id: string
    watcher: IWatcher
    user: IUser
    notifiedAt?: Date
}
