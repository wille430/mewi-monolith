import {EntityRepository} from "../database/entity.repository";
import {UserWatcherModel, UserWatcherDocument} from "@mewi/entities";

export class UserWatchersRepository extends EntityRepository<UserWatcherDocument> {
    constructor() {
        super(UserWatcherModel as any);
    }
}
