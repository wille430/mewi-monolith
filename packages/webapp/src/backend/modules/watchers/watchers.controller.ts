import { Role } from '@wille430/common'
import { Body, Delete, Get, Param, Post, Put, Query, ValidationPipe } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import { WatchersService } from './watchers.service'
import { CreateWatcherDto } from './dto/create-watcher.dto'
import { UpdateWatcherDto } from './dto/update-watcher.dto'
import { FindAllWatchersDto } from './dto/find-all-watchers.dto'
import { Roles } from '@/backend/middlewares/Roles'

@autoInjectable()
export class WatchersController {
    constructor(@inject(WatchersService) private readonly watchersService: WatchersService) {}

    @Post()
    @Roles(Role.ADMIN)
    async create(@Body(ValidationPipe) createWatcherDto: CreateWatcherDto) {
        console.log(createWatcherDto)
        return this.watchersService.create(createWatcherDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(
        @Query(
            ValidationPipe({
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true,
            })
        )
        query: FindAllWatchersDto
    ) {
        return this.watchersService.findAll(query)
    }

    @Get('/:id')
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.watchersService.findOne(id)
    }

    @Put('/:id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateWatcherDto: UpdateWatcherDto) {
        return this.watchersService.update(id, updateWatcherDto)
    }

    @Delete('/:id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.watchersService.remove(id)
    }
}
