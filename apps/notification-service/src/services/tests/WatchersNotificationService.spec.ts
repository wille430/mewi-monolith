import {WatchersNotificationService} from "../WatchersNotificationService"
import {FilteringService} from "@mewi/business"
import {MessageBroker, MQQueues, SendEmailDto} from "@mewi/mqlib"
import {ListingModel, UserModel, UserWatcherModel, WatcherModel} from "@mewi/entities"
import {expect, vi} from "vitest"
import {watcherStub} from "./stubs/watcherStub"
import {userStub} from "./stubs/userStub"
import {userWatcherStub} from "./stubs/userWatcherStub"
import {listingStub} from "./stubs/listingStub,ts"

describe("WatchersNotificationService", () => {

    let watchersNotificationService: WatchersNotificationService
    let filteringService: FilteringService
    let messageBroker: MessageBroker

    beforeEach(() => {
        messageBroker = new MessageBroker("https://localhost:5000");
        filteringService = new FilteringService();

        WatcherModel.find = vi.fn().mockImplementation(() => [watcherStub()]);
        UserModel.find = vi.fn().mockResolvedValue([userStub()]);
        UserWatcherModel.find = vi.fn().mockReturnValue({
            populate: () => {
                return {
                    populate: () => {
                        return [userWatcherStub()]
                    }
                }
            }
        } as any);
        UserWatcherModel.findOneAndUpdate = vi.fn().mockResolvedValue(userWatcherStub());
        ListingModel.aggregate = vi.fn().mockResolvedValue(new Array(10).fill(null).map(listingStub))

        messageBroker.sendMessage = vi.fn();

        watchersNotificationService = new WatchersNotificationService(filteringService, messageBroker);
    })

    describe("when notifyAll is called", () => {

        let currentTime: Date
        beforeEach(async () => {
            currentTime = new Date();
            vi.useFakeTimers().setSystemTime(currentTime);
            await watchersNotificationService.notifyAll();
        });

        it("then message broker should be called", () => {
            expect(messageBroker.sendMessage).toHaveBeenCalledOnce();
            expect(messageBroker.sendMessage).toHaveBeenCalledWith(MQQueues.SendEmail, expect.any(SendEmailDto))
        });

        it("then UserWatcher should be updated", () => {
            expect(UserWatcherModel.findOneAndUpdate).toHaveBeenCalledWith({
                userId: userStub().id,
                watcherId: watcherStub().id
            }, {
                notifiedAt: currentTime
            })
        })
    })

})