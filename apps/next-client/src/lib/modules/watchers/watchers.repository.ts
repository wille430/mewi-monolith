import { EntityRepository } from "../database/entity.repository";
import type { WatcherDocument } from "@mewi/entities";
import { WatcherModel } from "@mewi/entities";

export class WatchersRepository extends EntityRepository<WatcherDocument> {
    constructor() {
        super(WatcherModel as any);
    }
}
