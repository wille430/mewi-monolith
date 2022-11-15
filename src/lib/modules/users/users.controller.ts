import {
    Post,
    Get,
    Body,
    Query,
    Put,
    Res,
    UnprocessableEntityException,
    Param,
    Delete,
    HttpCode,
    BadRequestException,
} from 'next-api-decorators'
import type { IUser } from '@/common/schemas'
import { Role } from '@/common/schemas'
import { inject } from 'tsyringe'
import type { NextApiResponse } from 'next'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { FindAllUserDto } from './dto/find-all-user.dto'
import {
    AuthorizedUpdateEmailDto,
    RequestEmailUpdateDto,
    UpdateEmailDto,
} from './dto/update-email.dto'
import ChangePasswordDto, { ChangePasswordWithToken } from './dto/change-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import type { UserPayload } from '../common/types/UserPayload'
import { SessionGuard } from '@/lib/middlewares/SessionGuard'
import { Roles } from '@/lib/middlewares/roles.guard'
import { SuccessParam } from '../common/enum/successParam'
import { GetUser } from '@/lib/decorators/user.decorator'
import { Controller } from '@/lib/decorators/controller.decorator'
import { MyValidationPipe } from '@/lib/pipes/validation.pipe'
import { OptionalSessionGuard } from '@/lib/middlewares/optional-session.guard'

export const hiddenUserFields: (keyof IUser)[] = ['emailUpdate', 'password', 'passwordReset']

@Controller()
export class UsersController {
    constructor(@inject(UsersService) private readonly usersService: UsersService) {}

    @Post()
    @HttpCode(201)
    @Roles(Role.ADMIN)
    create(@Body(MyValidationPipe) createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(@Query(MyValidationPipe) findAllUserDto: FindAllUserDto = {}) {
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

    @Put('/email')
    @OptionalSessionGuard()
    async updateEmail(
        @Body(MyValidationPipe) updateEmailDto: UpdateEmailDto,
        @GetUser() user: UserPayload | undefined = undefined
    ) {
        if (updateEmailDto.newEmail && user) {
            await this.usersService.requestEmailUpdate(
                updateEmailDto as RequestEmailUpdateDto,
                user.userId
            )
        } else if (updateEmailDto.token) {
            await this.usersService.updateEmail(updateEmailDto)
        }
        return { message: 'OK' }
    }

    @Post('/email')
    @OptionalSessionGuard()
    async updateEmailPost(
        @GetUser() user: UserPayload,
        @Body(MyValidationPipe) updateEmailDto: UpdateEmailDto,
        @Res() res: NextApiResponse
    ) {
        if (updateEmailDto.newEmail && user) {
            await this.usersService.requestEmailUpdate(
                updateEmailDto as RequestEmailUpdateDto,
                user.userId
            )
            return { message: 'OK' }
        } else if (updateEmailDto.token) {
            await this.usersService.updateEmail(updateEmailDto)

            res.redirect(`/?success=${SuccessParam.UPDATED_EMAIL}`)
        }
    }

    @Get('/email/verify')
    async verifyEmail(@Query() dto: AuthorizedUpdateEmailDto, @Res() res: NextApiResponse) {
        try {
            await this.usersService.updateEmail(dto)
        } catch (e) {
            if (e instanceof BadRequestException) {
                return res.redirect(`/?success=${SuccessParam.VERIFY_EMAIL_FAILED}`)
            } else {
                throw e
            }
        }

        return res.redirect(`/?success=${SuccessParam.UPDATED_EMAIL}`)
    }

    @Put('/password')
    @OptionalSessionGuard()
    async changePassword(
        @Body(MyValidationPipe) dto: ChangePasswordDto,
        @GetUser() user: UserPayload | undefined = undefined
    ) {
        if (dto.password && dto.passwordConfirm) {
            if (dto.token && dto.email) {
                await this.usersService.changePasswordWithToken(dto as ChangePasswordWithToken)
            } else if (user?.userId) {
                await this.usersService.changePassword(
                    {
                        password: dto.password,
                        passwordConfirm: dto.passwordConfirm,
                    },
                    user.userId
                )
            }
            return { message: 'OK' }
        } else if (dto.email) {
            await this.usersService.sendPasswordResetEmail({
                email: dto.email,
            })
            return { message: 'OK' }
        }

        throw new UnprocessableEntityException()
    }

    @Get('/:id')
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Put('/:id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body(MyValidationPipe) updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete('/:id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
