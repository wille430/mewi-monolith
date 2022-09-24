import { UserPayload } from '@/auth/jwt-strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Role } from '@/schemas/enums/UserRole'
import { User } from '@/schemas/user.schema'
import faker from '@faker-js/faker'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import ChangePasswordDto from '../dto/change-password.dto'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateEmailDto } from '../dto/update-email.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { userPayloadStub } from './stubs/user-payload.stub'
import { userStub } from './stubs/user.stub'

jest.mock('../users.service')

describe('UsersController', () => {
    let usersController: UsersController
    let usersService: UsersService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [UsersController],
            providers: [UsersService, ConfigService, PrismaService],
        }).compile()

        usersController = moduleRef.get<UsersController>(UsersController)
        usersService = moduleRef.get<UsersService>(UsersService)
        jest.clearAllMocks()
    })

    describe('#findOne', () => {
        describe('when findOne is called', () => {
            let user: User

            beforeEach(async () => {
                user = (await usersController.findOne(userStub().id))!
            })

            it('then it should call usersService', () => {
                expect(usersService.findOne).toBeCalledWith(userStub().id)
            })

            it('then it should return the user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#findAll', () => {
        describe('when findAll is called', () => {
            let users: User[]

            beforeEach(async () => {
                users = await usersController.findAll()
            })

            it('then it should call usersService', () => {
                expect(usersService.findAll).toHaveBeenCalled()
            })

            it('then it should return the users', () => {
                expect(users).toEqual([userStub()])
            })
        })
    })

    describe('#create', () => {
        describe('when create is called', () => {
            let user: User
            let createUserDto: CreateUserDto

            beforeEach(async () => {
                createUserDto = {
                    email: userStub().email,
                    password: faker.internet.password(),
                }
                user = await usersController.create(createUserDto)
            })

            it('then it should call usersService', () => {
                expect(usersService.create).toHaveBeenCalledWith(createUserDto)
            })

            it('then it should return a user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#update', () => {
        describe('when update is called', () => {
            let user: User
            let updateUserDto: UpdateUserDto

            beforeEach(async () => {
                updateUserDto = {
                    email: faker.internet.email(),
                    roles: [Role.ADMIN],
                }
                user = (await usersController.update(userStub().id, updateUserDto))!
            })

            it('then it should call usersService', () => {
                expect(usersService.update).toHaveBeenCalledWith(userStub().id, updateUserDto)
            })

            it('then it should return a user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#remove', () => {
        describe('when remove is called', () => {
            let user: User | null

            beforeEach(async () => {
                user = await usersController.remove(userStub().id)
            })

            it('then it should call usersService', () => {
                expect(usersService.remove).toHaveBeenCalledWith(userStub().id)
            })

            it('then it should return a user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#updateEmail', () => {
        describe('when updateEmail is called', () => {
            describe('with newEmail', () => {
                let updateEmailDto: UpdateEmailDto
                let userPayload: UserPayload
                let ret: any

                beforeEach(async () => {
                    updateEmailDto = {
                        newEmail: userStub().email,
                    }
                    userPayload = userPayloadStub()
                    ret = await usersController.updateEmail(userPayload, updateEmailDto)
                })

                it('then it should have called usersService', () => {
                    expect(usersService.verifyEmailUpdate).toHaveBeenCalledWith(
                        updateEmailDto,
                        userPayload.userId
                    )
                })

                it('then it should return nothing', () => {
                    expect(ret).toBe(undefined)
                })
            })

            describe('with token', () => {
                let updateEmailDto: UpdateEmailDto
                let userPayload: UserPayload
                let ret: any

                beforeEach(async () => {
                    updateEmailDto = {
                        token: faker.random.alphaNumeric(32),
                    }
                    userPayload = userPayloadStub()
                    ret = await usersController.updateEmail(userPayload, updateEmailDto)
                })

                it('then it should have called usersService', () => {
                    expect(usersService.updateEmail).toHaveBeenCalledWith(updateEmailDto)
                })

                it('then it should return nothing', () => {
                    expect(ret).toBe(undefined)
                })
            })
        })
    })

    describe('#changePassword', () => {
        describe('when changePassword is called', () => {
            describe('with password, passwordConfirm and userPaylaod', () => {
                let changePasswordDto: ChangePasswordDto
                let ret: any

                beforeEach(async () => {
                    changePasswordDto = {
                        password: userStub().password,
                        passwordConfirm: userStub().password,
                    }

                    ret = await usersController.changePassword(changePasswordDto, userPayloadStub())
                })

                it('then it should call usersService', () => {
                    expect(usersService.changePassword).toHaveBeenCalledWith(
                        changePasswordDto,
                        userPayloadStub().userId
                    )
                })

                it('then it should return undefined', () => {
                    expect(ret).toBe(undefined)
                })
            })

            describe('with password, passwordConfirm, token and email', () => {
                let changePasswordDto: ChangePasswordDto
                let ret: any

                beforeEach(async () => {
                    changePasswordDto = {
                        password: userStub().password,
                        passwordConfirm: userStub().password,
                        email: userStub().email,
                        token: faker.random.alphaNumeric(32),
                    }

                    ret = await usersController.changePassword(changePasswordDto)
                })

                it('then it should call usersService', () => {
                    expect(usersService.changePasswordWithToken).toHaveBeenCalledWith(
                        changePasswordDto
                    )
                })

                it('then it should return undefined', () => {
                    expect(ret).toBe(undefined)
                })
            })

            describe('with email', () => {
                let changePasswordDto: ChangePasswordDto
                let ret: any

                beforeEach(async () => {
                    changePasswordDto = {
                        email: userStub().email,
                    }

                    ret = await usersController.changePassword(changePasswordDto)
                })

                it('then it should call usersService', () => {
                    expect(usersService.sendPasswordResetEmail).toHaveBeenCalledWith(
                        changePasswordDto
                    )
                })

                it('then it should return undefined', () => {
                    expect(ret).toBe(undefined)
                })
            })
        })
    })
})
