import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import type { FilterQuery } from 'mongoose'
import { userStub } from './stubs/user.stub'
import { UserModel } from './support/user.model'
import { UsersRepository } from '../users.repository'
import { User } from '@/schemas/user.schema'

describe('UsersRepository', () => {
    let usersRepository: UsersRepository

    describe('find operations', () => {
        let userModel: UserModel
        let userFilterQuery: FilterQuery<User>

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                providers: [
                    UsersRepository,
                    {
                        provide: getModelToken(User.name),
                        useClass: UserModel,
                    },
                ],
            }).compile()

            usersRepository = moduleRef.get<UsersRepository>(UsersRepository)
            userModel = moduleRef.get<UserModel>(getModelToken(User.name))

            userFilterQuery = {
                id: userStub().id,
            }

            jest.clearAllMocks()
        })

        describe('findOne', () => {
            describe('when findOne is called', () => {
                let user: User | null

                beforeEach(async () => {
                    jest.spyOn(userModel, 'findOne')
                    user = await usersRepository.findOne(userFilterQuery)
                })

                test('then it should call the userModel', () => {
                    expect(userModel.findOne).toHaveBeenCalledWith(userFilterQuery, {
                        __v: 0,
                    })
                })

                test('then it should return a user', () => {
                    expect(user).toEqual(userStub())
                })
            })
        })

        describe('find', () => {
            describe('when find is called', () => {
                let users: User[] | null

                beforeEach(async () => {
                    jest.spyOn(userModel, 'find')
                    users = await usersRepository.find(userFilterQuery)
                })

                test('then it should call the userModel', () => {
                    expect(userModel.find).toHaveBeenCalledWith(
                        userFilterQuery,
                        usersRepository.defaultProjection
                    )
                })

                test('then it should return a user', () => {
                    expect(users).toEqual([userStub()])
                })
            })
        })

        describe('findOneAndUpdate', () => {
            describe('when findOneAndUpdate is called', () => {
                let user: User | null

                beforeEach(async () => {
                    jest.spyOn(userModel, 'findOneAndUpdate')
                    user = await usersRepository.findOneAndUpdate(userFilterQuery, userStub())
                })

                test('then it should call the userModel', () => {
                    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
                        userFilterQuery,
                        userStub(),
                        { new: true }
                    )
                })

                test('then it should return a user', () => {
                    expect(user).toEqual(userStub())
                })
            })
        })
    })

    describe('create operations', () => {
        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                providers: [
                    UsersRepository,
                    {
                        provide: getModelToken(User.name),
                        useValue: UserModel,
                    },
                ],
            }).compile()

            usersRepository = moduleRef.get<UsersRepository>(UsersRepository)
        })

        describe('create', () => {
            describe('when create is called', () => {
                let user: User
                let saveSpy: jest.SpyInstance
                let constructorSpy: jest.SpyInstance

                beforeEach(async () => {
                    saveSpy = jest.spyOn(UserModel.prototype, 'save')
                    constructorSpy = jest.spyOn(UserModel.prototype, 'constructorSpy')
                    user = await usersRepository.create(userStub())
                })

                test('then it should call the userModel', () => {
                    expect(saveSpy).toHaveBeenCalled()
                    expect(constructorSpy).toHaveBeenCalledWith(userStub())
                })

                test('then it should return a user', () => {
                    expect(user).toEqual(userStub())
                })
            })
        })
    })
})