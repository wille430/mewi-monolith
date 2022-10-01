import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { createJwtAuthGuard } from '@/auth/test/support/jwt-auth.guard'
import { initTestModule } from '@/common/test/initTestModule'
import { CreateListingDto } from '@/listings/dto/create-listing.dto'
import { DeleteListingsDto } from '@/listings/dto/delete-listings.dto'
import { UpdateListingDto } from '@/listings/dto/update-listing.dto'
import { transformDate } from '@/listings/helpers/transform-dates'
import { Listing } from '@/schemas/listing.schema'
import { User } from '@/schemas/user.schema'
import { adminUserPayloadStub } from '@/users/test/stubs/admin-user-payload.stub'
import { adminStub } from '@/users/test/stubs/admin.stub'
import { userPayloadStub } from '@/users/test/stubs/user-payload.stub'
import { userStub } from '@/users/test/stubs/user.stub'
import faker from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import * as _ from 'lodash'
import mongoose, { Collection, Connection } from 'mongoose'
import * as request from 'supertest'
import { listingStub } from '../stubs/listing.strub'

const ADMIN_ENDPOINTS = [
    ['POST', '/listings'],
    ['DELETE', '/listings'],
    ['PUT', '/listings/' + listingStub().id],
    ['DELETE', '/listings/' + listingStub().id],
]

const USER_ENDPOINTS = [
    ['PUT', `/listings/${listingStub().id}/like`],
    ['PUT', `/listings/${listingStub().id}/unlike`],
]

describe('ListingsController', () => {
    let dbConnection: Connection
    let listingsCollection: Collection<Listing>
    let usersCollection: Collection<User>
    let httpServer: any
    let app: INestApplication

    describe('when authenticated as admin', () => {
        beforeEach(async () => {
            const testModule = await initTestModule((builder) => {
                builder
                    .overrideGuard(JwtAuthGuard)
                    .useClass(createJwtAuthGuard(adminUserPayloadStub()))
            })

            dbConnection = testModule.dbConnection
            app = testModule.app
            httpServer = testModule.httpServer

            listingsCollection = dbConnection.collection('listings')
            usersCollection = dbConnection.collection('users')
        })

        beforeEach(async () => {
            await listingsCollection.deleteMany({})
            await usersCollection.deleteMany({})
            await usersCollection.insertOne(adminStub())
        })

        afterAll(async () => {
            await app.close()
        })

        describe('POST /listings', () => {
            it('should return listing and create document', async () => {
                const dto: CreateListingDto = _.omit(listingStub(), '_id', 'id')
                const response = await request(httpServer).post('/listings').send(dto)

                expect(response.status).toBe(201)
                expect(response.body).toMatchObject(transformDate(dto))

                const listing = await listingsCollection.findOne({
                    _id: new mongoose.Types.ObjectId(response.body._id),
                })
                expect(listing).toMatchObject(dto)
            })
        })

        describe('DELETE /listings', () => {
            it('should return OK and delete document', async () => {
                await listingsCollection.insertOne(listingStub())

                const dto: DeleteListingsDto = {
                    origins: [listingStub().origin],
                }

                const response = await request(httpServer).del('/listings').send(dto)

                expect(response.status).toBe(200)

                const listing = await listingsCollection.findOne({
                    _id: listingStub()._id,
                })
                expect(listing).toBe(null)
            })
        })

        describe('PUT /listings/:id', () => {
            it('should return listing and update document', async () => {
                await listingsCollection.insertOne(listingStub())

                const dto: UpdateListingDto = {
                    title: faker.commerce.product(),
                }
                const response = await request(httpServer)
                    .put('/listings/' + listingStub().id)
                    .send(dto)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(
                    transformDate({
                        ...listingStub(),
                        ...dto,
                    })
                )

                const listing = await listingsCollection.findOne({
                    _id: listingStub()._id,
                })
                expect(listing).toMatchObject({
                    ...listingStub(),
                    ...dto,
                })
            })
        })

        describe('DELETE /listings/:id', () => {
            it('should return OK and delete document', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).del('/listings/' + listingStub().id)

                expect(response.status).toBe(200)

                const listing = await listingsCollection.findOne({
                    _id: listingStub()._id,
                })
                expect(listing).toBe(null)
            })
        })
    })

    describe('when authenticated as user', () => {
        beforeEach(async () => {
            const testModule = await initTestModule((builder) => {
                builder.overrideGuard(JwtAuthGuard).useClass(createJwtAuthGuard(userPayloadStub()))
            })

            dbConnection = testModule.dbConnection
            app = testModule.app
            httpServer = testModule.httpServer

            listingsCollection = dbConnection.collection('listings')
            usersCollection = dbConnection.collection('users')
        })

        beforeEach(async () => {
            await listingsCollection.deleteMany({})
            await usersCollection.deleteMany({})
            await usersCollection.insertOne(userStub())
        })

        afterAll(async () => {
            await app.close()
        })

        describe.each(ADMIN_ENDPOINTS)('%s %s', (method: string, path: string) => {
            beforeEach(async () => {
                await listingsCollection.insertOne(listingStub())
            })

            it('should return status code 403', async () => {
                // @ts-ignore
                const response = await request(httpServer)[method.toLowerCase()](path)
                expect(response.status).toBe(403)
            })
        })

        describe('PUT /listings/:id/like', () => {
            it('should return listing and create relation', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).put(`/listings/${listingStub().id}/like`)

                expect(response.status).toBe(200)

                const user = await usersCollection.findOne({
                    _id: userStub()._id,
                })
                expect(user?.likedListings).toMatchObject([listingStub()._id])
            })
        })

        describe('PUT /listings/:id/unlike', () => {
            it('should return listing and remove relation', async () => {
                await listingsCollection.insertOne(listingStub())

                // like first
                await request(httpServer).put(`/listings/${listingStub().id}/like`)
                // unlike
                const response = await request(httpServer).put(
                    `/listings/${listingStub().id}/unlike`
                )

                expect(response.status).toBe(200)

                const user = await usersCollection.findOne({
                    _id: userStub()._id,
                })
                expect(user?.likedListings).toMatchObject([])
            })
        })
    })

    describe('when not authenticated', () => {
        beforeEach(async () => {
            const testModule = await initTestModule()

            dbConnection = testModule.dbConnection
            app = testModule.app
            httpServer = testModule.httpServer

            listingsCollection = dbConnection.collection('listings')
            usersCollection = dbConnection.collection('users')
        })

        beforeEach(async () => {
            await listingsCollection.deleteMany({})
            await usersCollection.deleteMany({})
        })

        afterAll(async () => {
            await app.close()
        })

        describe.each([...USER_ENDPOINTS, ...ADMIN_ENDPOINTS])(
            '%s %s',
            (method: string, path: string) => {
                beforeEach(async () => {
                    await listingsCollection.insertOne(listingStub())
                })

                it('should return status code 401', async () => {
                    // @ts-ignore
                    const response = await request(httpServer)[method.toLowerCase()](path)
                    expect(response.status).toBe(401)
                })
            }
        )

        describe('GET /listings', () => {
            it('should return listings', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).get('/listings')

                expect(response.status).toBe(200)
                expect(response.body.totalHits).toBe(1)
                expect(response.body.hits).toMatchObject([transformDate(listingStub())])
            })
        })

        describe('GET /listings/featured', () => {
            it('should return listings', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).get('/listings/featured')

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([transformDate(listingStub())])
            })
        })

        describe('GET /listings/autocomplete/:keyword', () => {
            it('should return auto completions', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).get(
                    '/listings/autocomplete/' + _.take(listingStub().title, 4).join('')
                )

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([listingStub().title])
            })
        })

        describe('GET /listings/:id', () => {
            it('should return listing', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).get('/listings/' + listingStub().id)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(transformDate(listingStub()))
            })
        })
    })
})
