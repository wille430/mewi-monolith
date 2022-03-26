import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Watcher } from 'watchers/watcher.schema'
import { CreateWatcherDto } from './dto/create-watcher.dto'
import { UpdateWatcherDto } from './dto/update-watcher.dto'
import { Model, QueryOptions } from 'mongoose'
import { FindAllWatchersDto } from 'watchers/dto/find-all-watchers.dto'

@Injectable()
export class WatchersService {
  constructor(@InjectModel(Watcher.name) private watcherModel: Model<Watcher>) {}

  async exists(metadata: CreateWatcherDto['metadata']) {
    const count = await this.watcherModel.count({ metadata })
    return count === 0 ? false : true
  }

  async create(createWatcherDto: CreateWatcherDto) {
    const watcher = await this.watcherModel.create(createWatcherDto)

    return watcher.save()
  }

  async findAll(query: FindAllWatchersDto) {
    const { limit } = query
    const options: QueryOptions = {}

    if (limit) options.limit = +limit

    const watchers = await this.watcherModel.find({}, undefined, options)

    return watchers
  }

  async findOne(id: number) {
    return await this.watcherModel.findById(id)
  }

  async update(id: number, updateWatcherDto: UpdateWatcherDto) {
    return await this.watcherModel.updateOne({ _id: id }, updateWatcherDto)
  }

  async remove(id: number) {
    await this.watcherModel.deleteOne({ _id: id })
  }
}
