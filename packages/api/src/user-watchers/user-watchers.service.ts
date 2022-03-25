import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserWatcherDto } from './dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from './dto/update-user-watcher.dto'
import { Model, FilterQuery } from 'mongoose'
import { User } from 'users/user.schema'
import { UserWatcher } from 'user-watchers/user-watcher.schema'
import { PopulatedWatcher, Watcher } from 'watchers/watcher.schema'
import _ from 'lodash'
import mongoose from 'mongoose'

@Injectable()
export class UserWatchersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Watcher.name) private watcherModel: Model<Watcher>
  ) {}

  create(createUserWatcherDto: CreateUserWatcherDto) {
    // TODO

    // 1. Check if watcher with same metadata exists

    // 2. If false, create watcher

    // 3. Append user watcher to user

    return 'This action adds a new userWatcher'
  }

  async findAll(userId?: string): Promise<UserWatcher[]> {
    try {
      if (userId) {
        return (await this.userModel.findOne({ _id: userId }).select('watchers')).watchers
      } else {
        return (await this.userModel.findOne().select('watchers')).watchers
      }
    } catch (e) {
      return []
    }
  }

  async findOne(id: string, userId: string): Promise<UserWatcher> | undefined {
    try {
      const agg = await this.userModel.aggregate([
        { $limit: 1 },
        {
          $match: { _id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $unwind: {
            path: '$watchers',
          },
        },
        { $match: { 'watchers._id': new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'watchers',
            localField: 'watchers._id',
            foreignField: '_id',
            as: 'watchers.watcher',
          },
        },
        {
          $group: {
            _id: '$_id',
            watchers: {
              $push: '$watchers',
            },
          },
        },
      ])

      const watcher = agg[0].watchers[0]

      return watcher
    } catch (e) {
      return undefined
    }
  }

  update(id: string, updateUserWatcherDto: UpdateUserWatcherDto) {
    return `This action updates a #${id} userWatcher`
  }

  remove(id: string) {
    return `This action removes a #${id} userWatcher`
  }
}
