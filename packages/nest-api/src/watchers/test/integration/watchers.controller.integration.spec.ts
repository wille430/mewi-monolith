import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { createJwtAuthGuard } from '@/auth/test/support/jwt-auth.guard'
import { initTestModule } from '@/common/test/initTestModule'
import { transformDate } from '@/listings/helpers/transform-dates'
import { User } from '@/schemas/user.schema'
import { Watcher } from '@/schemas/watcher.schema'
import { adminUserPayloadStub } from '@/users/test/stubs/admin-user-payload.stub'
import { adminStub } from '@/users/test/stubs/admin.stub'
import { CreateWatcherDto } from '@/watchers/dto/create-watcher.dto'
import { FindAllWatchersDto } from '@/watchers/dto/find-all-watchers.dto'
import { UpdateWatcherDto } from '@/watchers/dto/update-watcher.dto'
import faker from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import * as _ from 'lodash'
import mongoose, { Collection, Connection } from 'mongoose'
import * as request from 'supertest'
import { watcherStub } from '../stubs/watcher.stub'

describe('WatchersController', () => {
    let dbConnection: Connection
    let watchersCollection: Collection<Watcher>
    let usersCollection: Collection<User>
    let httpServer: any
    let app: INestApplication

    beforeEach(async () => {
        const testModule = await initTestModule((builder) => {
            builder.overrideGuard(JwtAuthGuard).useClass(createJwtAuthGuard(adminUserPayloadStub()))
        })

        dbConnection = testModule.dbConnection
        app = testModule.app
        httpServer = testModule.httpServer

        watchersCollection = dbConnection.collection('watchers')
        usersCollection = dbConnection.collection('users')
    })

    beforeEach(async () => {
        await watchersCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await usersCollection.insertOne(adminStub())
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /watchers', () => {
        it('should return watcher and create it', async () => {
            const dto: CreateWatcherDto = {
                metadata: watcherStub().metadata,
            }
            const response = await request(httpServer).post('/watchers').send(dto)

            expect(response.status).toBe(201)
            expect(response.body).toMatchObject(dto)

            const watcher = await watchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(response.body._id),
            })
            expect(watcher).toMatchObject(dto)
        })
    })

    describe('GET /watchers', () => {
        describe('without filters', () => {
            it('it should return watchers', async () => {
                await watchersCollection.insertOne(watcherStub())

                const response = await request(httpServer).get('/watchers')

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

                const response = await request(httpServer).get('/watchers')

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([transformDate(watcherStub())])
            })
        })
    })

    describe('GET /watchers/:id', () => {
        it('should return watcher', async () => {
            await watchersCollection.insertOne(watcherStub())

            const response = await request(httpServer).get('/watchers/' + watcherStub().id)

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject(transformDate(watcherStub()))
        })
    })

    describe('PUT /watchers/:id', () => {
        it('should return watcher and update document', async () => {
            await watchersCollection.insertOne(watcherStub())

            let dto: UpdateWatcherDto = {
                metadata: {
                    auction: faker.datatype.boolean(),
                    keyword: faker.random.word(),
                },
            }

            const response = await request(httpServer)
                .put('/watchers/' + watcherStub().id)
                .send(dto)

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                ...transformDate(watcherStub()),
                ...dto,
            })

            const watcher = await watchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(watcherStub().id),
            })
            expect(response.body).toMatchObject(transformDate(watcher as any))
        })
    })

    describe('DELETE /watchers/:id', () => {
        it('it should delete watcher', async () => {
            await watchersCollection.insertOne(watcherStub())

            const response = await request(httpServer).del('/watchers/' + watcherStub().id)

            expect(response.status).toBe(200)

            const watcher = await watchersCollection.findOne({
                _id: new mongoose.Types.ObjectId(watcherStub().id),
            })
            expect(watcher).toBe(null)
        })
    })
})
