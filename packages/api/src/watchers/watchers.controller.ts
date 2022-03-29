import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common'
import { WatchersService } from './watchers.service'
import { CreateWatcherDto } from './dto/create-watcher.dto'
import { UpdateWatcherDto } from './dto/update-watcher.dto'
import { FindAllWatchersDto } from '@/watchers/dto/find-all-watchers.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/roles.decorator'
import { Role } from '@/auth/role.enum'

@Controller('watchers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WatchersController {
    constructor(private readonly watchersService: WatchersService) {}

    @Post()
    @Roles(Role.Admin)
    create(@Body() createWatcherDto: CreateWatcherDto) {
        return this.watchersService.create(createWatcherDto)
    }

    @Get()
    @Roles(Role.Admin)
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
    @Roles(Role.Admin)
    findOne(@Param('id') id: string) {
        return this.watchersService.findOne(+id)
    }

    @Patch(':id')
    @Roles(Role.Admin)
    update(@Param('id') id: string, @Body() updateWatcherDto: UpdateWatcherDto) {
        return this.watchersService.update(+id, updateWatcherDto)
    }

    @Delete(':id')
    @Roles(Role.Admin)
    remove(@Param('id') id: string) {
        return this.watchersService.remove(+id)
    }
}
