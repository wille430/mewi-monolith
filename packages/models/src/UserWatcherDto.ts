import {IEntity} from "./IEntity"
import {WatcherDto} from "./WatcherDto"
import {UserDto} from "./UserDto"

export interface UserWatcherDto extends IEntity {
    id: string
    watcher: WatcherDto
    user: UserDto
    notifiedAt?: Date
}