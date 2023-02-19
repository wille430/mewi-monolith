import {autoInjectable, inject} from "tsyringe";
import {ObjectId} from "mongodb";
import type {CreateWatcherDto} from "./dto/create-watcher.dto";
import type {FindAllWatchersDto} from "./dto/find-all-watchers.dto";
import type {UpdateWatcherDto} from "./dto/update-watcher.dto";
import {ListingsService} from "../listings/listings.service";
import {WatcherModel, UserWatcherModel} from "@mewi/entities";
import {MessageBroker, MQQueues, NotifyWatchersDto} from "@mewi/mqlib";

@autoInjectable()
export class WatchersService {

    private readonly messageBroker: MessageBroker;

    constructor(
        @inject(ListingsService) private readonly listingService: ListingsService,
    ) {
        this.messageBroker = new MessageBroker(process.env.MQ_CONNECTION_STRING);
    }

    async exists(metadata: CreateWatcherDto["metadata"]) {
        const count = await WatcherModel.count({metadata});
        return count !== 0;
    }

    async create(createWatcherDto: CreateWatcherDto) {
        return WatcherModel.create(createWatcherDto);
    }

    async findAll(query: FindAllWatchersDto) {
        const {limit} = query;
        const options: any = {};

        if (limit) options.take = +limit;

        return WatcherModel.find({
            ...options,
        });
    }

    async findOne(id: string) {
        return WatcherModel.findById(id);
    }

    async update(id: string, updateWatcherDto: UpdateWatcherDto) {
        return WatcherModel.findByIdAndUpdate(id, {$set: updateWatcherDto});
    }

    async remove(id: string) {
        await WatcherModel.findByIdAndDelete(id);
    }

    async subscriberCount(watcherId: string): Promise<number> {
        return UserWatcherModel.count({
            watcher: new ObjectId(watcherId),
        });
    }

    notifyAll(): Promise<boolean> {
        return this.messageBroker.sendMessage(MQQueues.NotifyWatchers, new NotifyWatchersDto());
    }
}
