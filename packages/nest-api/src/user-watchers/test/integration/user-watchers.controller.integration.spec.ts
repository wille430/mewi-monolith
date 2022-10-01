import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { createJwtAuthGuard } from '@/auth/test/support/jwt-auth.guard'
import { initTestModule } from '@/common/test/initTestModule'
import { transformDate } from '@/listings/helpers/transform-dates'
import { UserWatcher } from '@/schemas/user-watcher.schema'
import { User } from '@/schemas/user.schema'
import { Watcher, WatcherDocument } from '@/schemas/watcher.schema'
import { CreateUserWatcherDto } from '@/user-watchers/dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from '@/user-watchers/dto/update-user-watcher.dto'
import { userPayloadStub } from '@/users/test/stubs/user-payload.stub'
import { userStub } from '@/users/test/stubs/user.stub'
import { watcherStub } from '@/watchers/test/stubs/watcher.stub'
import faker from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { WithId } from 'mongodb'
import mongoose, { Collection, Connection } from 'mongoose'
import * as request from 'supertest'
import { createUserWatcherStub, userWatcherStub } from '../user-watcher.stub'

describe('UserWatchersController', () => {
    let dbConnection: Connection
    let userWatchersCollection: Collection<UserWatcher>
    let usersCollection: Collection<User>
    let watchersCollection: Collection<Watcher>
    let httpServer: any
    let app: INestApplication

    beforeEach(async () => {
        const testModule = await initTestModule((builder) => {
            builder.overrideGuard(JwtAuthGuard).useClass(createJwtAuthGuard(userPayloadStub()))
        })

        dbConnection = testModule.dbConnection
        app = testModule.app
        httpServer = testModule.httpServer

        userWatchersCollection = dbConnection.collection('userwatchers')
        watchersCollection = dbConnection.collection('watchers')
        usersCollection = dbConnection.collection('users')
    })

    beforeEach(async () => {
        await userWatchersCollection.deleteMany({})
        await watchersCollection.deleteMany({})
        await usersCollection.deleteMany({})
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /users/me/watchers', () => {
        it('should return user watcher', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())

            const dto: CreateUserWatcherDto = {
                metadata: userWatcherStub().watcher.metadata,
                userId: userStub().id,
            }
            const response = await request(httpServer).post('/users/me/watchers').send(dto)

            expect(response.status).toBe(201)
            expect(response.body).toMatchObject({
                watcher: transformDate(watcherStub()),
                user: transformDate(userStub()),
            })
        })
    })

    describe('GET /users/me/watchers', () => {
        it('should return user watchers of user', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())
            await userWatchersCollection.insertOne(createUserWatcherStub())

            const response = await request(httpServer).get('/users/me/watchers')

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject([createUserWatcherStub()])
        })
    })

    describe('GET /users/me/watchers/:id', () => {
        it('should return user watcher', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())
            await userWatchersCollection.insertOne(createUserWatcherStub())

            const response = await request(httpServer).get(
                '/users/me/watchers/' + userWatcherStub().id
            )

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                ...createUserWatcherStub(),
                watcher: transformDate(watcherStub()),
            })
        })
    })

    describe('PUT /users/me/watchers/:id', () => {
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
                    .put('/users/me/watchers/' + userWatcherStub().id)
                    .send(dto)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject({
                    ...userWatcherStub(),
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
                const watcher2: WithId<Watcher> = {
                    _id: new mongoose.Types.ObjectId(id),
                    id,
                    metadata: {
                        keyword: faker.commerce.product(),
                    },
                }
                await watchersCollection.insertOne(watcher2)

                await userWatchersCollection.insertOne(createUserWatcherStub())

                const dto: UpdateUserWatcherDto = {
                    metadata: watcher2.metadata,
                    userId: userStub().id,
                }

                const response = await request(httpServer)
                    .put('/users/me/watchers/' + userWatcherStub().id)
                    .send(dto)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject({
                    ...userWatcherStub(),
                    user: userStub().id,
                    watcher: watcher2,
                })

                const oldWatcher = await watchersCollection.findOne({
                    _id: watcherStub()._id,
                })
                expect(oldWatcher).toBe(null)
            })
        })
    })

    describe('DELETE /users/me/watchers/:id', () => {
        it('should return OK and delete document', async () => {
            await usersCollection.insertOne(userStub())
            await watchersCollection.insertOne(watcherStub())
            await userWatchersCollection.insertOne(createUserWatcherStub())

            const response = await request(httpServer).del('/users/me/watchers/' + userStub().id)

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
