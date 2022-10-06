import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Put,
    UnprocessableEntityException,
    Res,
    Query,
} from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import _ from 'lodash'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateEmailDto } from './dto/update-email.dto'
import { FindAllUserDto } from './dto/find-all-user.dto'
import { Roles } from '@/auth/roles.decorator'
import { JwtAuthGuard, OptionalJwtAuthGuard } from '@/auth/jwt-auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import ChangePasswordDto, { ChangePasswordWithToken } from '@/users/dto/change-password.dto'
import { Public } from '@/common/decorators/public.decorator'
import { GetUser } from '@/common/decorators/user.decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { SuccessParam } from '@/common/enum/successParam'
import { User } from '@/schemas/user.schema'
import { Role } from '@wille430/common'

export const hiddenUserFields: (keyof User)[] = ['emailUpdate', 'password', 'passwordReset']

@Controller('/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(@Query() findAllUserDto: FindAllUserDto = {}) {
        return this.usersService.findAll(findAllUserDto)
    }

    @Get('me')
    async getMe(@GetUser() user: UserPayload) {
        return this.usersService.findOne(user.userId)
    }

    @Get('me/likes')
    async getMyLikes(@GetUser() user: UserPayload) {
        return this.usersService.getLikedListings(user.userId)
    }

    @Put('email')
    @Public()
    @UseGuards(OptionalJwtAuthGuard)
    async updateEmail(@GetUser() user: UserPayload, @Body() updateEmailDto: UpdateEmailDto) {
        if (updateEmailDto.newEmail && user) {
            return this.usersService.requestEmailUpdate(updateEmailDto, user.userId)
        } else if (updateEmailDto.token) {
            return this.usersService.updateEmail(updateEmailDto)
        }
    }

    @Post('email')
    @Public()
    @UseGuards(OptionalJwtAuthGuard)
    async updateEmailPost(
        @GetUser() user: UserPayload,
        @Body() updateEmailDto: UpdateEmailDto,
        @Res() res: Response
    ) {
        if (updateEmailDto.newEmail && user) {
            return this.usersService.requestEmailUpdate(updateEmailDto, user.userId)
        } else if (updateEmailDto.token) {
            await this.usersService.updateEmail(updateEmailDto)

            const webappUrl =
                this.configService.get<string>('CLIENT_URL') +
                `/?success=${SuccessParam.UPDATED_EMAIL}`
            res.redirect(webappUrl)
        }
    }

    @Put('password')
    @Public()
    @UseGuards(OptionalJwtAuthGuard)
    async changePassword(
        @Body()
        dto: ChangePasswordDto,
        @GetUser() user: UserPayload | undefined = undefined
    ) {
        if (dto.password && dto.passwordConfirm) {
            if (user?.userId) {
                return this.usersService.changePassword(
                    {
                        password: dto.password,
                        passwordConfirm: dto.passwordConfirm,
                    },
                    user.userId
                )
            } else if (dto.token && dto.email) {
                return this.usersService.changePasswordWithToken(dto as ChangePasswordWithToken)
            }
        } else if (dto.email) {
            return this.usersService.sendPasswordResetEmail({
                email: dto.email,
            })
        }

        throw new UnprocessableEntityException()
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
