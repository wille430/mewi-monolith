import faker from '@faker-js/faker'
import { Role } from '@wille430/common'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { userPayloadStub } from './stubs/user-payload.stub'
import { userStub } from './stubs/user.stub'
import type ChangePasswordDto from '../dto/change-password.dto'
import type { CreateUserDto } from '../dto/create-user.dto'
import type { UpdateEmailDto } from '../dto/update-email.dto'
import type { UpdateUserDto } from '../dto/update-user.dto'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { User } from '../../schemas/user.schema'
import { Listing } from '../../schemas/listing.schema'
import { UserPayload } from '../../common/types/UserPayload'

jest.mock('../users.service')
jest.mock('../users.repository')

describe('UsersController', () => {
    let usersController: UsersController
    let usersService: UsersService

    beforeEach(async () => {
        usersController = container.resolve(UsersController)
        usersService = container.resolve(UsersService)
        jest.clearAllMocks()
    })

    describe('#findOne', () => {
        describe('when findOne is called', () => {
            let user: User

            beforeEach(async () => {
                user = (await usersController.findOne(userStub().id)) as User
            })

            it('then it should call usersService', () => {
                expect(usersService.findOne).toBeCalledWith(userStub().id)
            })

            it('then it should return the user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#me', () => {
        describe('when me is called', () => {
            let user: User

            beforeEach(async () => {
                user = (await usersController.getMe(userPayloadStub())) as User
            })

            it('then it should call usersService', () => {
                expect(usersService.findOne).toBeCalledWith(userStub().id)
            })

            it('then it should return the user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#getMyLikes', () => {
        describe('when getMyLikes is called', () => {
            let likedListings: Listing[]

            beforeEach(async () => {
                likedListings = await usersController.getMyLikes(userPayloadStub())
            })

            it('then it should call usersService', () => {
                expect(usersService.getLikedListings).toHaveBeenCalledWith(userPayloadStub().userId)
            })

            it('then it should return listings', () => {
                expect(userStub().likedListings).toMatchObject(likedListings)
            })
        })
    })

    describe('#findAll', () => {
        describe('when findAll is called', () => {
            let users: User[]

            beforeEach(async () => {
                users = (await usersController.findAll()) ?? []
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
                user = (await usersController.update(userStub().id, updateUserDto)) as User
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

                beforeEach(async () => {
                    updateEmailDto = {
                        newEmail: userStub().email,
                    }
                    userPayload = userPayloadStub()
                    await usersController.updateEmail(updateEmailDto, userPayload)
                })

                it('then it should have called usersService', () => {
                    expect(usersService.requestEmailUpdate).toHaveBeenCalledWith(
                        updateEmailDto,
                        userPayload.userId
                    )
                })
            })

            describe('with token', () => {
                let updateEmailDto: UpdateEmailDto
                let userPayload: UserPayload

                beforeEach(async () => {
                    updateEmailDto = {
                        token: faker.random.alphaNumeric(32),
                    }
                    userPayload = userPayloadStub()
                    await usersController.updateEmail(updateEmailDto, userPayload)
                })

                it('then it should have called usersService', () => {
                    expect(usersService.updateEmail).toHaveBeenCalledWith(updateEmailDto)
                })
            })
        })
    })

    describe('#changePassword', () => {
        describe('when changePassword is called', () => {
            describe('with password, passwordConfirm and userPaylaod', () => {
                let changePasswordDto: ChangePasswordDto

                beforeEach(async () => {
                    changePasswordDto = {
                        password: userStub().password,
                        passwordConfirm: userStub().password,
                    }

                    await usersController.changePassword(changePasswordDto, userPayloadStub())
                })

                it('then it should call usersService', () => {
                    expect(usersService.changePassword).toHaveBeenCalledWith(
                        changePasswordDto,
                        userPayloadStub().userId
                    )
                })
            })

            describe('with password, passwordConfirm, token and email', () => {
                let changePasswordDto: ChangePasswordDto

                beforeEach(async () => {
                    changePasswordDto = {
                        password: userStub().password,
                        passwordConfirm: userStub().password,
                        email: userStub().email,
                        token: faker.random.alphaNumeric(32),
                    }

                    await usersController.changePassword(changePasswordDto)
                })

                it('then it should call usersService', () => {
                    expect(usersService.changePasswordWithToken).toHaveBeenCalledWith(
                        changePasswordDto
                    )
                })
            })

            describe('with email', () => {
                let changePasswordDto: ChangePasswordDto

                beforeEach(async () => {
                    changePasswordDto = {
                        email: userStub().email,
                    }

                    await usersController.changePassword(changePasswordDto)
                })

                it('then it should call usersService', () => {
                    expect(usersService.sendPasswordResetEmail).toHaveBeenCalledWith(
                        changePasswordDto
                    )
                })
            })
        })
    })
})
