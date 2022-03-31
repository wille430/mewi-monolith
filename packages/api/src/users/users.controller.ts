import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Put,
    UnprocessableEntityException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Roles } from '@/auth/roles.decorator'
import { Role } from '@/auth/role.enum'
import { JwtAuthGuard, OptionalJwtAuthGuard } from '@/auth/jwt-auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import ChangePasswordDto from '@/users/dto/change-password.dto'
import { Public } from '@/decorators/public.decorator'
import { GetUser } from '@/decorators/user.decorator'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Roles(Role.Admin)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @Roles(Role.Admin)
    findAll() {
        return this.usersService.findAll()
    }

    @Get('me')
    getMe(@GetUser() user) {
        return this.usersService.findOne(user.userId)
    }

    @Put('password')
    @Public()
    @UseGuards(OptionalJwtAuthGuard)
    async changePassword(
        @Body()
        dto: ChangePasswordDto,
        @GetUser() user
    ) {
        if (dto.password && dto.passwordConfirm) {
            if (user?.userId) {
                return this.usersService.changePassword(dto, user.userId)
            } else if (dto.token) {
                return this.usersService.changePasswordWithToken(dto)
            }
        } else if (dto.email) {
            return this.usersService.sendPasswordResetEmail(dto)
        }

        throw new UnprocessableEntityException()
    }

    @Get(':id')
    @Roles(Role.Admin)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id)
    }

    @Patch(':id')
    @Roles(Role.Admin)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto)
    }

    @Delete(':id')
    @Roles(Role.Admin)
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id)
    }
}
