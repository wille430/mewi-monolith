import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { UserWatchersService } from './user-watchers.service'
import { CreateUserWatcherDto } from './dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from './dto/update-user-watcher.dto'
import { JwtAuthGuard } from 'auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('users/:user_id/watchers')
export class UserWatchersController {
  constructor(private readonly userWatchersService: UserWatchersService) {}

  @Post()
  create(@Body() createUserWatcherDto: CreateUserWatcherDto) {
    return this.userWatchersService.create(createUserWatcherDto)
  }

  @Get()
  findAll() {
    return this.userWatchersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userWatchersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserWatcherDto: UpdateUserWatcherDto) {
    return this.userWatchersService.update(+id, updateUserWatcherDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userWatchersService.remove(+id)
  }
}
