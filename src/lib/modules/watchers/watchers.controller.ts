import { Role } from '@/common/schemas'
import { Body, Delete, Get, HttpCode, Param, Post, Put, Query } from 'next-api-decorators'
import { inject } from 'tsyringe'
import { WatchersService } from './watchers.service'
import { CreateWatcherDto } from './dto/create-watcher.dto'
import { UpdateWatcherDto } from './dto/update-watcher.dto'
import { Roles } from '@/lib/middlewares/roles.guard'
import { Controller } from '@/lib/decorators/controller.decorator'
import { MyValidationPipe } from '@/lib/pipes/validation.pipe'
import { FindAllWatchersDto } from './dto/find-all-watchers.dto'

@Controller()
export class WatchersController {
    constructor(@inject(WatchersService) private readonly watchersService: WatchersService) {}

    @Post()
    @HttpCode(201)
    @Roles(Role.ADMIN)
    async create(@Body(MyValidationPipe) createWatcherDto: CreateWatcherDto) {
        console.log(createWatcherDto)
        return this.watchersService.create(createWatcherDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(
        @Query(
            MyValidationPipe({
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
    update(@Param('id') id: string, @Body(MyValidationPipe) updateWatcherDto: UpdateWatcherDto) {
        return this.watchersService.update(id, updateWatcherDto)
    }

    @Delete('/:id')
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: string) {
        await this.watchersService.remove(id)
        return 'OK'
    }
}
