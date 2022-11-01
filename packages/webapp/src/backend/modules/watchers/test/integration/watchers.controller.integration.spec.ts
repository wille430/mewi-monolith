import faker from '@faker-js/faker'
import type { Collection, Connection } from 'mongoose'
import mongoose from 'mongoose'
import request from 'supertest'
import { createHandler } from 'next-api-decorators'
import { Server } from 'http'
import { watcherStub } from '../stubs/watcher.stub'
import { CreateWatcherDto } from '../../dto/create-watcher.dto'
import { FindAllWatchersDto } from '../../dto/find-all-watchers.dto'
import { UpdateWatcherDto } from '../../dto/update-watcher.dto'
import { WatchersController } from '../../watchers.controller'
import { Watcher } from '@/backend/modules/schemas/watcher.schema'
import { User } from '@/backend/modules/schemas/user.schema'
import { dbConnection } from '@/backend/lib/dbConnection'
import { createTestClient } from '@/backend/modules/common/test/createTestClient'
import { adminUserPayloadStub } from '@/backend/modules/users/test/stubs/admin-user-payload.stub'
import { adminStub } from '@/backend/modules/users/test/stubs/admin.stub'
import { transformDate } from '@/backend/modules/listings/helpers/transform-dates'

describe('WatchersController', () => {
    let dbConn: Connection
    let watchersCollection: Collection<Watcher>
    let usersCollection: Collection<User>
    let httpServer: Server

    beforeEach(async () => {
        dbConn = await dbConnection()
        httpServer = createTestClient(createHandler(WatchersController), adminUserPayloadStub())

        watchersCollection = dbConn.collection('watchers')
        usersCollection = dbConn.collection('users')
    })

    beforeEach(async () => {
        await watchersCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await usersCollection.insertOne(adminStub())
    })

    afterAll(() => {
        httpServer.close()
    })

    describe('POST /api/watchers', () => {
        it('should return watcher and create it', async () => {
            const dto: CreateWatcherDto = {
                metadata: watcherStub().metadata,
            }
            const response = await request(httpServer).post('/api/watchers').send(dto)

            expect(response.status).toBe(201)
            expect(response.body).toMatchObject(dto)

            const watcher = await watchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(response.body._id),
            })
            expect(watcher).toMatchObject(dto)
        })
    })

    describe('GET /api/watchers', () => {
        describe('without filters', () => {
            it('it should return watchers', async () => {
                await watchersCollection.insertOne(watcherStub())

                const response = await request(httpServer).get('/api/watchers')

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([transformDate(watcherStub())])
            })
        })

        describe('with filters', () => {
            let filters: FindAllWatchersDto

            beforeEach(() => {
                filters = {
                    limit: faker.datatype.number({
                        min: 1,
                        max: 100,
                    }),
                }
            })

            it('it should return watchers', async () => {
                await watchersCollection.insertOne(watcherStub())

                const response = await request(httpServer).get('/api/watchers')

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([transformDate(watcherStub())])
            })
        })
    })

    describe('GET /api/watchers/:id', () => {
        it('should return watcher', async () => {
            await watchersCollection.insertOne(watcherStub())

            const response = await request(httpServer).get('/api/watchers/' + watcherStub().id)

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject(transformDate(watcherStub()))
        })
    })

    describe('PUT /api/watchers/:id', () => {
        it('should return watcher and update document', async () => {
            await watchersCollection.insertOne(watcherStub())

            const dto: UpdateWatcherDto = {
                metadata: {
                    auction: faker.datatype.boolean(),
                    keyword: faker.random.word(),
                },
            }

            const response = await request(httpServer)
                .put('/api/watchers/' + watcherStub().id)
                .send(dto)

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                ...transformDate(watcherStub()),
                ...dto,
                updatedAt: expect.any(String),
            })

            const watcher = await watchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(watcherStub().id),
            })
            expect(response.body).toMatchObject(transformDate(watcher as any))
        })
    })

    describe('DELETE /api/watchers/:id', () => {
        it('it should delete watcher', async () => {
            await watchersCollection.insertOne(watcherStub())

            const response = await request(httpServer).del('/api/watchers/' + watcherStub().id)

            expect(response.status).toBe(200)

            const watcher = await watchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(watcherStub().id),
            })
            expect(watcher).toBe(null)
        })
    })
})
