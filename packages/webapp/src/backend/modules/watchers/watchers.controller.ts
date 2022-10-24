import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    ValidationPipe,
    UseGuards,
    Put,
} from '@nestjs/common'
import { Role } from '@wille430/common'
import type { WatchersService } from './watchers.service'
import type { CreateWatcherDto } from './dto/create-watcher.dto'
import type { UpdateWatcherDto } from './dto/update-watcher.dto'
import type { FindAllWatchersDto } from '@/watchers/dto/find-all-watchers.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/roles.decorator'

@Controller('/watchers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WatchersController {
    constructor(private readonly watchersService: WatchersService) {}

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createWatcherDto: CreateWatcherDto) {
        return this.watchersService.create(createWatcherDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(
        @Query(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true,
            })
        )
        query: FindAllWatchersDto
    ) {
        return this.watchersService.findAll(query)
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.watchersService.findOne(id)
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateWatcherDto: UpdateWatcherDto) {
        return this.watchersService.update(id, updateWatcherDto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.watchersService.remove(id)
    }
}
