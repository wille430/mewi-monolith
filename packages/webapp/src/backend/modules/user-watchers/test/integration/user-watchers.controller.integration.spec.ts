import faker from '@faker-js/faker'
import type { Collection, Connection } from 'mongoose'
import mongoose from 'mongoose'
import request from 'supertest'
import { timestampsStub } from '@mewi/test-utils'
import { createHandler } from 'next-api-decorators'
import { Server } from 'http'
import { MyWatchersController } from '../../user-watchers.controller'
import { createUserWatcherStub, userWatcherStub } from '../user-watcher.stub'
import { CreateUserWatcherDto } from '../../dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from '../../dto/update-user-watcher.dto'
import { dbConnection } from '@/backend/lib/dbConnection'
import { User } from '@/backend/modules/schemas/user.schema'
import { UserWatcher } from '@/backend/modules/schemas/user-watcher.schema'
import { createTestClient } from '@/backend/modules/common/test/createTestClient'
import { Watcher } from '@/backend/modules/schemas/watcher.schema'
import { userStub } from '@/backend/modules/users/test/stubs/user.stub'
import { watcherStub } from '@/backend/modules/watchers/test/stubs/watcher.stub'
import { userPayloadStub } from '@/backend/modules/users/test/stubs/user-payload.stub'
import { transformDate } from '@/backend/modules/listings/helpers/transform-dates'

describe('UserWatchersController', () => {
    let dbConn: Connection
    let userWatchersCollection: Collection<UserWatcher>
    let usersCollection: Collection<User>
    let watchersCollection: Collection<Watcher>
    let httpServer: Server

    beforeEach(async () => {
        dbConn = await dbConnection()
        httpServer = createTestClient(createHandler(MyWatchersController), userPayloadStub())

        userWatchersCollection = dbConn.collection('userwatchers')
        watchersCollection = dbConn.collection('watchers')
        usersCollection = dbConn.collection('users')
    })

    beforeEach(async () => {
        await userWatchersCollection.deleteMany({})
        await watchersCollection.deleteMany({})
        await usersCollection.deleteMany({})
    })

    afterAll(() => {
        httpServer.close()
    })

    describe('POST /api/user-watchers', () => {
        it('should return user watcher', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())

            const dto: CreateUserWatcherDto = {
                metadata: (userWatcherStub().watcher as Watcher).metadata,
                userId: userStub().id,
            }
            const response = await request(httpServer).post('/api/user-watchers').send(dto)

            expect(response.status).toBe(201)
            expect(response.body).toMatchObject({
                watcher: transformDate(watcherStub()),
                user: transformDate(userStub()),
            })
        })
    })

    describe('GET /api/user-watchers', () => {
        it('should return user watchers of user', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())
            await userWatchersCollection.insertOne(createUserWatcherStub())

            const response = await request(httpServer).get('/api/user-watchers')

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject([transformDate(createUserWatcherStub())])
        })
    })

    describe('GET /api/user-watchers/:id', () => {
        it('should return user watcher', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())
            await userWatchersCollection.insertOne(createUserWatcherStub())

            const response = await request(httpServer).get(
                '/api/user-watchers/' + userWatcherStub().id
            )

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                ...transformDate(createUserWatcherStub()),
                watcher: transformDate(watcherStub()),
            })
        })
    })

    describe('PUT /api/user-watchers/:id', () => {
        describe('with no watcher matching new metadata', () => {
            it('should return user and update', async () => {
                await usersCollection.insertOne(userStub())
                await watchersCollection.insertOne(watcherStub())
                await userWatchersCollection.insertOne(createUserWatcherStub())

                const dto: UpdateUserWatcherDto = {
                    metadata: {
                        keyword: faker.random.word(),
                    },
                    userId: userStub().id,
                }

                const response = await request(httpServer)
                    .put('/api/user-watchers/' + userWatcherStub().id)
                    .send(dto)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject({
                    ...userWatcherStub(),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    user: userStub().id,
                    watcher: {
                        metadata: dto.metadata,
                    },
                })
            })
        })

        describe('with watcher matching new metadata', () => {
            it('should return user and update', async () => {
                await usersCollection.insertOne(userStub())
                await watchersCollection.insertOne(watcherStub())

                const id = faker.database.mongodbObjectId()
                const watcher2 = {
                    _id: new mongoose.Types.ObjectId(id),
                    id,
                    metadata: {
                        keyword: faker.commerce.product(),
                    },
                    ...timestampsStub(),
                }
                await watchersCollection.insertOne(watcher2)

                await userWatchersCollection.insertOne(createUserWatcherStub())

                const dto: UpdateUserWatcherDto = {
                    metadata: watcher2.metadata,
                    userId: userStub().id,
                }

                const response = await request(httpServer)
                    .put('/api/user-watchers/' + userWatcherStub().id)
                    .send(dto)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject({
                    ...userWatcherStub(),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    user: userStub().id,
                    watcher: {
                        ...watcher2,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                })

                const oldWatcher = await watchersCollection.findOne({
                    _id: watcherStub()._id,
                })
                expect(oldWatcher).toBe(null)
            })
        })
    })

    describe('DELETE /api/user-watchers/:id', () => {
        it('should return OK and delete document', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())
            await userWatchersCollection.insertOne(createUserWatcherStub())

            const response = await request(httpServer).del('/api/user-watchers/' + userStub().id)

            expect(response.status).toBe(200)

            const userWatcher = await userWatchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(userWatcherStub().id),
            })
            const watcher = await watchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(userWatcherStub().id),
            })

            expect(userWatcher).toBe(null)
            expect(watcher).toBe(null)
        })
    })
})
