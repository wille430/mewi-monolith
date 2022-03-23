import { Injectable } from '@nestjs/common';
import { CreateUserWatcherDto } from './dto/create-user-watcher.dto';
import { UpdateUserWatcherDto } from './dto/update-user-watcher.dto';

@Injectable()
export class UserWatchersService {
  create(createUserWatcherDto: CreateUserWatcherDto) {
    return 'This action adds a new userWatcher';
  }

  findAll() {
    return `This action returns all userWatchers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userWatcher`;
  }

  update(id: number, updateUserWatcherDto: UpdateUserWatcherDto) {
    return `This action updates a #${id} userWatcher`;
  }

  remove(id: number) {
    return `This action removes a #${id} userWatcher`;
  }
}
