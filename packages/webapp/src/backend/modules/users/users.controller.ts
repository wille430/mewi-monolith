import {
    Post,
    Get,
    Body,
    ValidationPipe,
    Query,
    Put,
    Res,
    UnprocessableEntityException,
    Param,
    Delete,
} from 'next-api-decorators'
import type { IUser } from '@wille430/common'
import { SuccessParam } from '@wille430/common'
import { Role } from '@wille430/common'
import { autoInjectable, inject } from 'tsyringe'
import type { NextApiResponse } from 'next'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { FindAllUserDto } from './dto/find-all-user.dto'
import { UpdateEmailDto } from './dto/update-email.dto'
import { ChangePasswordWithToken } from './dto/change-password.dto'
import ChangePasswordDto from './dto/change-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { GetUser } from '../common/decorators/user.decorator'
import type { UserPayload } from '../common/types/UserPayload'
import { SessionGuard } from '@/backend/middlewares/SessionGuard'
import { Roles } from '@/backend/middlewares/Roles'

export const hiddenUserFields: (keyof IUser)[] = ['emailUpdate', 'password', 'passwordReset']

@autoInjectable()
export class UsersController {
    constructor(@inject(UsersService) private readonly usersService: UsersService) {}

    @Post()
    @SessionGuard()
    create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(@Query(ValidationPipe) findAllUserDto: FindAllUserDto = {}) {
        return this.usersService.findAll(findAllUserDto)
    }

    @Get('/me')
    @SessionGuard()
    async getMe(@GetUser() user: UserPayload) {
        return this.usersService.findOne(user.userId)
    }

    @Get('/me/likes')
    @SessionGuard()
    async getMyLikes(@GetUser() user: UserPayload) {
        return this.usersService.getLikedListings(user.userId)
    }

    @Put('email')
    async updateEmail(
        @Body(ValidationPipe) updateEmailDto: UpdateEmailDto,
        @GetUser() user: UserPayload | undefined = undefined
    ) {
        if (updateEmailDto.newEmail && user) {
            return this.usersService.requestEmailUpdate(updateEmailDto, user.userId)
        } else if (updateEmailDto.token) {
            return this.usersService.updateEmail(updateEmailDto)
        }
    }

    @Post('email')
    async updateEmailPost(
        @GetUser() user: UserPayload,
        @Body(ValidationPipe) updateEmailDto: UpdateEmailDto,
        @Res() res: NextApiResponse
    ) {
        if (updateEmailDto.newEmail && user) {
            return this.usersService.requestEmailUpdate(updateEmailDto, user.userId)
        } else if (updateEmailDto.token) {
            await this.usersService.updateEmail(updateEmailDto)

            const webappUrl = new URL(
                `/?success=${SuccessParam.UpdatedEmail}`,
                process.env.NEXT_PUBLIC_API_URL
            ).toString()

            res.redirect(webappUrl)
        }
    }

    @Put('password')
    async changePassword(
        @Body(ValidationPipe) dto: ChangePasswordDto,
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
    update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
