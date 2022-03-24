import { Injectable } from '@nestjs/common';
import { CreateWatcherDto } from './dto/create-watcher.dto';
import { UpdateWatcherDto } from './dto/update-watcher.dto';

@Injectable()
export class WatchersService {
  create(createWatcherDto: CreateWatcherDto) {
    return 'This action adds a new watcher';
  }

  findAll() {
    return `This action returns all watchers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} watcher`;
  }

  update(id: number, updateWatcherDto: UpdateWatcherDto) {
    return `This action updates a #${id} watcher`;
  }

  remove(id: number) {
    return `This action removes a #${id} watcher`;
  }
}
