import { WatchersNotifService } from "../WatchersNotifService";
import { FilteringService } from "@mewi/business";
import {
  ListingModel,
  UserModel,
  UserWatcherModel,
  WatcherModel,
} from "@mewi/entities";
import { vi } from "vitest";
import { watcherStub } from "./stubs/watcherStub";
import { userStub } from "./stubs/userStub";
import { userWatcherStub } from "./stubs/userWatcherStub";
import { listingStub } from "./stubs/listingStub,ts";
import { NotifFactory } from "../NotifFactory";
import { MessageBroker } from "@mewi/mqlib";

vi.mock("@typegoose/typegoose", async () => {
  const actual: any = await vi.importActual("@typegoose/typegoose");
  return {
    ...actual,
    isDocument: vi.fn().mockReturnValue(true),
  };
});

describe("WatchersNotificationService", () => {
  let watchersNotificationService: WatchersNotifService;
  let filteringService: FilteringService;
  let notifFactory: NotifFactory;

  beforeEach(() => {
    filteringService = new FilteringService();
    notifFactory = new NotifFactory(
      new MessageBroker("https://localhost:5000")
    );

    WatcherModel.find = vi.fn().mockReturnValue([watcherStub()]);
    UserModel.find = vi.fn().mockResolvedValue([userStub()]);
    UserWatcherModel.find = vi.fn().mockReturnValue([
      Object.assign(userWatcherStub(), {
        populate: vi.fn(),
        save: vi.fn(),
      }),
    ]);
    UserWatcherModel.findOneAndUpdate = vi
      .fn()
      .mockResolvedValue(userWatcherStub());
    ListingModel.aggregate = vi
      .fn()
      .mockResolvedValue(new Array(10).fill(null).map(listingStub));

    notifFactory.createNotif = vi.fn().mockReturnValue({
      send: vi.fn(),
    });

    watchersNotificationService = new WatchersNotifService(
      filteringService,
      notifFactory
    );
  });

  describe("when notifyAll is called", () => {
    let currentTime: Date;
    beforeEach(async () => {
      currentTime = new Date();
      vi.useFakeTimers().setSystemTime(currentTime);
    });

    describe("and there are watchers that should be notified", () => {
      beforeEach(async () => {
        await watchersNotificationService.notifyAll();
      });

      it("then listings should have been aggregated", () => {
        expect(ListingModel.aggregate).toHaveBeenCalledWith(
          expect.arrayContaining([
            {
              $search: expect.any(Object),
            },
          ])
        );
      });

      it("then notifFactory.createNotif() should have been called", () => {
        expect(notifFactory.createNotif).toHaveBeenCalledOnce();
      });
    });

    describe("and watchers has been notified recently", () => {
      beforeEach(async () => {
        await watchersNotificationService.notifyAll();
      });

      beforeEach(() => {
        UserWatcherModel.find = vi.fn().mockReturnValue([
          Object.assign(userWatcherStub(), {
            notifiedAt: currentTime,
            populate: vi.fn(),
          }),
        ]);
      });

      it("then it should not call notifFactory", () => {
        expect(notifFactory.createNotif).not.toHaveBeenCalled();
      });
    });
  });
});