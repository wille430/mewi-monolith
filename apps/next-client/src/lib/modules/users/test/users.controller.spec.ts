import {faker} from '@faker-js/faker'
import 'reflect-metadata'
import {container} from 'tsyringe'
import {userPayloadStub} from './stubs/user-payload.stub'
import {userStub} from './stubs/user.stub'
import type ChangePasswordDto from '../dto/change-password.dto'
import type {CreateUserDto} from '../dto/create-user.dto'
import {UpdateEmailDto} from '../dto/update-email.dto'
import type {UpdateUserDto} from '../dto/update-user.dto'
import {UsersController} from '../users.controller'
import {UsersService} from '../users.service'
import {User, Listing} from '@mewi/entities'
import {createHandler} from '@/lib/middlewares/createHandler'
import {RequestMock, createRequestMock} from '@/common/test/utils/requestMock'
import {UsersRepository} from '../users.repository'
import {plainToInstance} from 'class-transformer'
import {Role, UserDto} from "@mewi/models"

jest.mock('../users.service')
jest.mock('../users.repository')
jest.mock('../../../middlewares/roles.guard')
jest.mock('../../../session/getSession')

describe('UsersController', () => {
    let usersService: UsersService
    let usersRepository: UsersRepository
    let request: RequestMock

    beforeEach(async () => {
        usersService = container.resolve(UsersService)
        usersRepository = container.resolve(UsersRepository)

        request = createRequestMock(createHandler(UsersController))

        jest.clearAllMocks()
    })

    describe('#findOne', () => {
        describe('when findOne is called', () => {
            let user: UserDto

            beforeEach(async () => {
                user = await request({
                    method: 'GET',
                    url: '/api/users/' + userStub().id,
                })
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
                user = await request({
                    method: 'GET',
                    url: '/api/users/me',
                })
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
                likedListings = await request({
                    method: 'GET',
                    url: '/api/users/me/likes',
                })
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
                users = await request({
                    method: 'GET',
                    url: '/api/users',
                })
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

                user = await request({
                    method: 'POST',
                    url: '/api/users',
                    body: createUserDto,
                })
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

                user = await request({
                    method: 'PUT',
                    url: '/api/users/' + userStub().id,
                    body: updateUserDto,
                })
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
                user = await request({
                    method: 'DELETE',
                    url: '/api/users/' + userStub().id,
                })
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

                beforeEach(async () => {
                    usersRepository.count = jest.fn().mockResolvedValue(0)
                    updateEmailDto = {
                        newEmail: faker.internet.email(),
                    }

                    await request({
                        method: 'PUT',
                        url: '/api/users/email',
                        body: updateEmailDto,
                    })
                })

                it('then it should have called usersService', () => {
                    expect(usersService.requestEmailUpdate).toHaveBeenCalledWith(
                        plainToInstance(UpdateEmailDto, updateEmailDto),
                        userPayloadStub().userId
                    )
                })
            })

            describe('with token', () => {
                let updateEmailDto: UpdateEmailDto

                beforeEach(async () => {
                    updateEmailDto = {
                        token: faker.random.alphaNumeric(32),
                        oldEmail: userStub().email,
                    }

                    await request({
                        method: 'PUT',
                        url: '/api/users/email',
                        body: updateEmailDto,
                    })
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

                    await request({
                        method: 'PUT',
                        url: '/api/users/password',
                        body: changePasswordDto,
                    })
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

                    await request({
                        method: 'PUT',
                        url: '/api/users/password',
                        body: changePasswordDto,
                    })
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

                    await request({
                        method: 'PUT',
                        url: '/api/users/password',
                        body: changePasswordDto,
                    })
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
