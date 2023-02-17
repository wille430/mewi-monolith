import {Body, Delete, Get, HttpCode, Param, Post, Put} from 'next-api-decorators'
import {inject} from 'tsyringe'
import {UserWatchersService} from './user-watchers.service'
import {CreateUserWatcherDto} from './dto/create-user-watcher.dto'
import {UpdateUserWatcherDto} from './dto/update-user-watcher.dto'
import type {UserPayload} from '../common/types/UserPayload'
import {SessionGuard} from '@/lib/middlewares/SessionGuard'
import {Roles} from '@/lib/middlewares/roles.guard'
import {GetUser} from '@/lib/decorators/user.decorator'
import {Controller} from '@/lib/decorators/controller.decorator'
import {MyValidationPipe} from '@/lib/pipes/validation.pipe'
import {Role} from "@mewi/models"

@Controller()
export class MyWatchersController {
    constructor(
        @inject(UserWatchersService) private readonly userWatchersService: UserWatchersService
    ) {
    }

    @Post()
    @HttpCode(201)
    @SessionGuard()
    create(
        @Body(MyValidationPipe) createUserWatcherDto: CreateUserWatcherDto,
        @GetUser() user: UserPayload
    ) {
        return this.userWatchersService.create({...createUserWatcherDto, userId: user.userId})
    }

    @Get()
    @SessionGuard()
    findAll(@GetUser() user: UserPayload) {
        return this.userWatchersService.findAll(user.userId)
    }

    @Get('/:id')
    @SessionGuard()
    findOne(@Param('id') id: string, @GetUser() user: UserPayload) {
        return this.userWatchersService.findOne(id, user.userId)
    }

    @Put('/:id')
    @SessionGuard()
    update(
        @Param('id') id: string,
        @Body(MyValidationPipe) updateUserWatcherDto: UpdateUserWatcherDto
    ) {
        return this.userWatchersService.update(id, updateUserWatcherDto)
    }

    @Delete('/:id')
    @SessionGuard()
    remove(@Param('id') id: string, @GetUser() user: UserPayload) {
        return this.userWatchersService.remove(id, user.userId)
    }
}

@SessionGuard()
export class UserWatchersController {
    constructor(private readonly userWatchersService: UserWatchersService) {
    }

    @Post()
    @Roles(Role.ADMIN)
    create(@Body(MyValidationPipe) createUserWatcherDto: CreateUserWatcherDto) {
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
        @Body(MyValidationPipe) updateUserWatcherDto: UpdateUserWatcherDto
    ) {
        return this.userWatchersService.update(id, updateUserWatcherDto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string, @Param('user_id') userId: string) {
        return this.userWatchersService.remove(id, userId)
    }
}
