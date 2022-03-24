import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WatchersService } from './watchers.service';
import { CreateWatcherDto } from './dto/create-watcher.dto';
import { UpdateWatcherDto } from './dto/update-watcher.dto';

@Controller('watchers')
export class WatchersController {
  constructor(private readonly watchersService: WatchersService) {}

  @Post()
  create(@Body() createWatcherDto: CreateWatcherDto) {
    return this.watchersService.create(createWatcherDto);
  }

  @Get()
  findAll() {
    return this.watchersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.watchersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWatcherDto: UpdateWatcherDto) {
    return this.watchersService.update(+id, updateWatcherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.watchersService.remove(+id);
  }
}
