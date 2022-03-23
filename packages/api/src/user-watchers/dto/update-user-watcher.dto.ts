import { PartialType } from '@nestjs/mapped-types';
import { CreateUserWatcherDto } from './create-user-watcher.dto';

export class UpdateUserWatcherDto extends PartialType(CreateUserWatcherDto) {}
