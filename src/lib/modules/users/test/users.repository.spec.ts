import type { FilterQuery } from 'mongoose'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { userStub } from './stubs/user.stub'
import { UsersRepository } from '../users.repository'
import { User, UserModel } from '../../schemas/user.schema'

jest.mock('../../schemas/user.schema')

describe('UsersRepository', () => {
    let usersRepository: UsersRepository

    describe('find operations', () => {
        let userFilterQuery: FilterQuery<User>

        beforeEach(async () => {
            usersRepository = container.resolve(UsersRepository)

            userFilterQuery = {
                id: userStub().id,
            }

            jest.clearAllMocks()
        })

        describe('findOne', () => {
            describe('when findOne is called', () => {
                let user: User | null

                beforeEach(async () => {
                    user = await usersRepository.findOne(userFilterQuery)
                })

                test('then it should call the userModel', () => {
                    expect(UserModel.findOne).toHaveBeenCalledWith(userFilterQuery, {
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
                    users = await usersRepository.find(userFilterQuery)
                })

                test('then it should call the userModel', () => {
                    expect(UserModel.find).toHaveBeenCalledWith(
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
                    user = await usersRepository.findOneAndUpdate(userFilterQuery, userStub())
                })

                test('then it should call the userModel', () => {
                    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
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
            usersRepository = container.resolve(UsersRepository)
        })

        describe('create', () => {
            describe('when create is called', () => {
                let user: User

                beforeEach(async () => {
                    user = await usersRepository.create(userStub())
                })

                test('then it should return a user', () => {
                    expect(user).toEqual(userStub())
                })
            })
        })
    })
})
