import { faker } from '@faker-js/faker'
import 'reflect-metadata'
import { container } from 'tsyringe'
import bcrypt from 'bcrypt'
import { userStub } from './stubs/user.stub'
import type {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from '../dto/change-password.dto'
import type { CreateUserDto } from '../dto/create-user.dto'
import type { FindAllUserDto } from '../dto/find-all-user.dto'
import type { UpdateUserDto } from '../dto/update-user.dto'
import { UsersRepository } from '../users.repository'
import { UsersService } from '../users.service'
import type { AuthorizedUpdateEmailDto, RequestEmailUpdateDto } from '../dto/update-email.dto'
import { User } from '../../schemas/user.schema'
import { listingStub } from '../../listings/test/stubs/listing.stub'
import { Listing } from '../../schemas/listing.schema'

jest.mock('../users.repository')

describe('UsersService', () => {
    let usersService: UsersService
    let usersRepository: UsersRepository

    beforeEach(async () => {
        usersService = container.resolve(UsersService)
        usersRepository = container.resolve(UsersRepository)

        jest.clearAllMocks()
    })

    describe('#findAll', () => {
        describe('when findAll is called', () => {
            let users: User[] | null
            let findAllUserDto: FindAllUserDto

            beforeEach(async () => {
                findAllUserDto = {
                    email: userStub().email,
                }

                users = await usersService.findAll(findAllUserDto)
            })

            it('then it should call the usersRepository', () => {
                expect(usersRepository.find).toHaveBeenCalledWith(findAllUserDto)
            })

            it('then it should return users', () => {
                expect(users).toEqual([userStub()])
            })
        })
    })

    describe('#create', () => {
        describe('when create is called', () => {
            let user: User | null
            let createUserDto: CreateUserDto

            beforeEach(async () => {
                createUserDto = userStub()

                user = await usersService.create(createUserDto)
            })

            it('then it should call the usersRepository', () => {
                expect(usersRepository.create).toHaveBeenCalledWith(createUserDto)
            })

            it('then it should return user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#findOne', () => {
        describe('when findOne is called', () => {
            let user: User | null

            beforeEach(async () => {
                user = await usersService.findOne(userStub().id)
            })

            it('then it should call the usersRepository', () => {
                expect(usersRepository.findById).toHaveBeenCalledWith(userStub().id)
            })

            it('then it should return user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#update', () => {
        describe('when update is called', () => {
            let user: User | null
            let updateUserDto: UpdateUserDto

            beforeEach(async () => {
                updateUserDto = userStub()
                user = await usersService.update(userStub().id, updateUserDto)
            })

            it('then it should call the usersRepository', () => {
                expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(
                    userStub().id,
                    updateUserDto
                )
            })

            it('then it should return user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#remove', () => {
        describe('when remove is called', () => {
            let user: User | null

            beforeEach(async () => {
                user = await usersService.remove(userStub().id)
            })

            it('then it should call the usersRepository', () => {
                expect(usersRepository.findByIdAndDelete).toHaveBeenCalledWith(userStub().id)
            })

            it('then it should return user', () => {
                expect(user).toEqual(userStub())
            })
        })
    })

    describe('#changePassword', () => {
        describe('when changePassword is called', () => {
            let changePasswordAuthDto: ChangePasswordAuth
            let ret: any

            beforeEach(async () => {
                changePasswordAuthDto = {
                    password: userStub().password,
                    passwordConfirm: userStub().password,
                }
                ret = await usersService.changePassword(changePasswordAuthDto, userStub().id)
            })

            it('then it should call the usersRepository', () => {
                expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(
                    userStub().id,
                    expect.anything()
                )
            })

            it('then it should return undefined', () => {
                expect(ret).toBe(undefined)
            })
        })
    })

    describe('#changePasswordWithToken', () => {
        describe('when changePasswordWithToken is called', () => {
            describe('with password reset object on user', () => {
                let dto: ChangePasswordWithToken
                let ret: any

                beforeEach(async () => {
                    const token = faker.random.alphaNumeric(32)
                    dto = {
                        email: userStub().email,
                        token: token,
                        password: userStub().password,
                        passwordConfirm: userStub().password,
                    }

                    jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
                        ...userStub(),
                        passwordReset: {
                            expiration: new Date().getTime() + 99999999,
                            tokenHash: token,
                        },
                    } as any)

                    // Pass bcrypt comparation
                    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false)

                    ret = await usersService.changePasswordWithToken(dto)
                })

                it('then it should call the usersRepository', () => {
                    expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(
                        userStub().id,
                        expect.anything()
                    )
                })

                it('then it should return undefined', () => {
                    expect(ret).toBe(undefined)
                })
            })

            describe('without necessary password reset object on user', () => {
                let dto: ChangePasswordWithToken

                beforeEach(async () => {
                    const token = faker.random.alphaNumeric(32)
                    dto = {
                        email: userStub().email,
                        token: token,
                        password: userStub().password,
                        passwordConfirm: userStub().password,
                    }
                })

                it('then it should return undefined', () => {
                    expect(usersService.changePasswordWithToken(dto)).rejects.toThrow()
                })
            })
        })
    })

    describe('#sendPasswordResetEmail', () => {
        describe('when sendPasswordResetEmail is called', () => {
            let ret: any
            let changePasswordNoAuthDto: ChangePasswordNoAuth

            beforeEach(async () => {
                changePasswordNoAuthDto = {
                    email: userStub().email,
                }

                ret = await usersService.sendPasswordResetEmail(changePasswordNoAuthDto)
            })

            it('then it should call the usersRepository', () => {
                expect(usersRepository.findOne).toHaveBeenCalledWith(changePasswordNoAuthDto)
            })

            it('then it should update user', () => {
                expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(
                    userStub().id,
                    expect.anything()
                )
            })

            it('then it should return undefined', () => {
                expect(ret).toBe(undefined)
            })
        })
    })

    describe('#updateEmail', () => {
        describe('when updateEmail is called', () => {
            describe('with emailUpdate object on user', () => {
                let ret: any
                let authorizedUpdateEmailDto: AuthorizedUpdateEmailDto
                let emailUpdateObj: User['emailUpdate']

                beforeEach(async () => {
                    const token = faker.random.alphaNumeric(32)
                    authorizedUpdateEmailDto = {
                        oldEmail: userStub().email,
                        token: token,
                    }
                    emailUpdateObj = {
                        expiration: new Date(Date.now() + 999999),
                        newEmail: userStub().email,
                        tokenHash: token,
                    }

                    jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
                        ...userStub(),
                        emailUpdate: emailUpdateObj,
                    } as any)

                    // Pass bcrypt comparation
                    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true)

                    ret = await usersService.updateEmail(authorizedUpdateEmailDto)
                })

                it('then it should call the usersRepository', () => {
                    expect(usersRepository.findOne).toHaveBeenCalledWith({
                        email: userStub().email,
                    })
                })

                it('then it should update the user', () => {
                    expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(userStub().id, {
                        email: emailUpdateObj?.newEmail,
                        emailUpdate: null,
                    })
                })

                it('then it should return undefined', () => {
                    expect(ret).toBe(undefined)
                })
            })

            describe('without emailUpdate object on user', () => {
                let authorizedUpdateEmailDto: AuthorizedUpdateEmailDto

                beforeEach(() => {
                    authorizedUpdateEmailDto = {
                        oldEmail: userStub().email,
                        token: faker.random.alphaNumeric(32),
                    }
                })

                it('then it should throw', () => {
                    expect(usersService.updateEmail(authorizedUpdateEmailDto)).rejects.toThrow(
                        Error
                    )
                })
            })
        })
    })

    describe('#requestEmailUpdate', () => {
        describe('when requestEmailUpdate is called', () => {
            let ret: any
            let verifyEmailDto: RequestEmailUpdateDto

            beforeEach(async () => {
                verifyEmailDto = {
                    newEmail: userStub().email,
                }

                ret = await usersService.requestEmailUpdate(verifyEmailDto, userStub().id)
            })

            it('then it should call usersRepository', () => {
                expect(usersRepository.findById).toHaveBeenCalledWith(userStub().id)
            })

            it('then it should update user', () => {
                expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(
                    userStub().id,
                    expect.anything()
                )
            })

            it('then it should return undefined', () => {
                expect(ret).toBe(undefined)
            })
        })
    })

    describe('#getLikedListings', () => {
        describe('when getLikedListings is called', () => {
            let likedListings: Listing[]
            beforeEach(async () => {
                jest.spyOn(usersRepository, 'findById').mockResolvedValue({
                    ...userStub(),
                    likedListings: [listingStub()],
                    populate: jest.fn(),
                } as any)

                likedListings = await usersService.getLikedListings(userStub().id)
            })

            it('then it should return listings', () => {
                expect([listingStub()]).toMatchObject(likedListings)
            })
        })
    })
})
