import { Role } from '@wille430/common'
import { Body, Delete, Get, Param, Post, Put, ValidationPipe } from 'next-api-decorators'
import type { UserWatchersService } from './user-watchers.service'
import { CreateUserWatcherDto } from './dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from './dto/update-user-watcher.dto'
import { GetUser } from '../common/decorators/user.decorator'
import type { UserPayload } from '../common/types/UserPayload'
import { SessionGuard } from '@/backend/middlewares/SessionGuard'
import { Roles } from '@/backend/middlewares/Roles'

@SessionGuard()
export class MyWatchersController {
    constructor(private readonly userWatchersService: UserWatchersService) {}

    @Post()
    create(@Body() createUserWatcherDto: CreateUserWatcherDto, @GetUser() user: UserPayload) {
        return this.userWatchersService.create({ ...createUserWatcherDto, userId: user.userId })
    }

    @Get()
    findAll(@GetUser() user: UserPayload) {
        return this.userWatchersService.findAll(user.userId)
    }

    @Get('/:id')
    findOne(@Param('id') id: string, @GetUser() user: UserPayload) {
        return this.userWatchersService.findOne(id, user.userId)
    }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() updateUserWatcherDto: UpdateUserWatcherDto) {
    //     return this.userWatchersService.update(id, updateUserWatcherDto)
    // }

    @Delete('/:id')
    remove(@Param('id') id: string, @GetUser() user: UserPayload) {
        return this.userWatchersService.remove(id, user.userId)
    }
}

@SessionGuard()
export class UserWatchersController {
    constructor(private readonly userWatchersService: UserWatchersService) {}

    @Post()
    @Roles(Role.ADMIN)
    create(@Body(ValidationPipe) createUserWatcherDto: CreateUserWatcherDto) {
        return this.userWatchersService.create(createUserWatcherDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(@Param('user_id') userId: string) {
        return this.userWatchersService.findAll(userId)
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string, @Param('user_id') userId: string) {
        return this.userWatchersService.findOne(id, userId)
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    update(
        @Param('id') id: string,
        @Body(ValidationPipe) updateUserWatcherDto: UpdateUserWatcherDto
    ) {
        return this.userWatchersService.update(id, updateUserWatcherDto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string, @Param('user_id') userId: string) {
        return this.userWatchersService.remove(id, userId)
    }
}
