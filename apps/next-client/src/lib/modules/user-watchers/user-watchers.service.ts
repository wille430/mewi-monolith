import mongoose from "mongoose";
import { autoInjectable, inject } from "tsyringe";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "next-api-decorators";
import type { CreateUserWatcherDto } from "./dto/create-user-watcher.dto";
import { UserWatchersRepository } from "./user-watchers.repository";
import { UpdateUserWatcherDto } from "./dto/update-user-watcher.dto";
import { WatchersRepository } from "../watchers/watchers.repository";
import { WatchersService } from "../watchers/watchers.service";
import { UsersRepository } from "../users/users.repository";
import { UserWatcherModel, WatcherDocument } from "@mewi/entities";
import { IPagination, ListingDto } from "@mewi/models";
import assert from "assert";
import { ListingsService } from "@/lib/modules/listings/listings.service";

@autoInjectable()
export class UserWatchersService {
  constructor(
    @inject(WatchersService) private watchersService: WatchersService,
    @inject(UserWatchersRepository)
    private readonly userWatchersRepository: UserWatchersRepository,
    @inject(WatchersRepository)
    private readonly watchersRepository: WatchersRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(ListingsService) private readonly listingsService: ListingsService
  ) {}

  async create({ userId, metadata }: CreateUserWatcherDto) {
    userId = userId!;
    let watcher = await this.watchersRepository.findOne({ metadata });

    // 1. Create new watcher if watcher doesn't exist already
    if (!watcher) {
      watcher = await this.watchersRepository.create({ metadata });
    }

    // 2. Append user watcher to user
    const user = await this.usersRepository.findById(userId);
    if (!user) return null;

    // 3. If user is already subscribed to the watcher, throw error
    const count = await this.userWatchersRepository.count({
      user: user.id,
      watcher: watcher.id,
    });
    const isSubscribed = count > 0;
    if (isSubscribed) {
      throw new ConflictException(
        "You are already subscribed to a similar watcher"
      );
    } else {
      return this.userWatchersRepository.create({
        user: user,
        watcher: watcher,
      });
    }
  }

  async findAll(userId: string) {
    return await this.userWatchersRepository.find(
      {
        user: userId,
      },
      {},
      {
        watcher: true,
      }
    );
  }

  public async getNewItemsForWatcher(
    userWatcherId: string,
    pagination: IPagination
  ): Promise<ListingDto[]> {
    const userWatcher = await UserWatcherModel.findById(userWatcherId);
    if (userWatcher == null)
      throw new Error(`User Watcher with id ${userWatcherId} was not found`);

    await userWatcher.populate("watcher");
    assert(userWatcher.watcher as WatcherDocument);

    const { _doc: metadata } = (userWatcher.watcher as WatcherDocument)
      .metadata as any;

    const { hits: listings } = await this.listingsService.findAll({
      ...metadata,
      dateGte: userWatcher.notifiedAt,
      ...pagination,
    });

    return listings;
  }

  public async getFromUser(userId: string) {
    return UserWatcherModel.find({
      user: new mongoose.Types.ObjectId(userId),
    }).populate("watcher");
  }

  async findOne(id: string, userId: string) {
    const userWatcher = await this.userWatchersRepository.findOne({
      id: id,
      user: new mongoose.Types.ObjectId(userId),
    });

    await userWatcher?.populate("watcher");

    return userWatcher;
  }

  async update(id: string, { userId, metadata }: UpdateUserWatcherDto) {
    if (!userId) {
      throw new BadRequestException("User id must be defined");
    }

    const oldUserWatcher = await this.userWatchersRepository.findOne({
      id,
      user: userId,
    });
    if (!oldUserWatcher) {
      throw new NotFoundException(`No user watcher with id ${id} was found`);
    }

    let watcher: WatcherDocument;

    if (await this.watchersService.exists(metadata)) {
      watcher = (await this.watchersRepository.findOne({
        metadata,
      }))!;
    } else {
      watcher = await this.watchersService.create({
        metadata,
      });
    }

    await this.userWatchersRepository.findByIdAndUpdate(id, {
      $set: {
        watcher: watcher.id,
      },
    });

    const oldWatcherId = (
      oldUserWatcher.watcher as mongoose.Types.ObjectId
    ).toString();
    if (
      oldUserWatcher &&
      watcher &&
      (await this.watchersService.subscriberCount(oldWatcherId)) === 0
    ) {
      await this.watchersService.remove(oldWatcherId);
    }

    return this.findOne(id, userId);
  }

  /**
   * Unsubscribe a user from a watcher
   *
   * @param id - The id of the user watcher
   * @param userId - The id of the user
   * @returns True if the user watcher was deleted, else false
   */
  async remove(id: string, userId: string): Promise<boolean> {
    const userWatcher = await this.userWatchersRepository.findOne({
      id,
      user: userId,
    });
    const watcherId = (userWatcher?.watcher as any)?.toString();
    if (!watcherId) return false;

    // delete from user
    await this.userWatchersRepository.findByIdAndDelete(userWatcher?.id);

    // delete watcher if no one is subscribed
    const subCount = await this.watchersService.subscriberCount(watcherId);

    if (subCount <= 0) {
      await this.watchersRepository.findByIdAndDelete(watcherId);
    }

    return true;
  }
}
