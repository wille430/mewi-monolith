import faker from '@faker-js/faker'
import _ from 'lodash'
import type { Collection, Connection } from 'mongoose'
import mongoose from 'mongoose'
import request from 'supertest'
import { createHandler } from 'next-api-decorators'
import { Server } from 'http'
import { listingStub } from '../stubs/listing.stub'
import { ListingsController } from '../../listings.controller'
import { CreateListingDto } from '../../dto/create-listing.dto'
import { transformDate } from '../../helpers/transform-dates'
import { DeleteListingsDto } from '../../dto/delete-listings.dto'
import { UpdateListingDto } from '../../dto/update-listing.dto'
import { dbConnection } from '@/backend/lib/dbConnection'
import { User } from '@/backend/modules/schemas/user.schema'
import { Listing } from '@/backend/modules/schemas/listing.schema'
import { createTestClient } from '@/backend/modules/common/test/createTestClient'
import { adminStub } from '@/backend/modules/users/test/stubs/admin.stub'
import { adminUserPayloadStub } from '@/backend/modules/users/test/stubs/admin-user-payload.stub'
import { userPayloadStub } from '@/backend/modules/users/test/stubs/user-payload.stub'
import { userStub } from '@/backend/modules/users/test/stubs/user.stub'

const ADMIN_ENDPOINTS = [
    ['POST', '/api/listings'],
    ['DELETE', '/api/listings'],
    ['PUT', '/api/listings/' + listingStub().id],
    ['DELETE', '/api/listings/' + listingStub().id],
]

const USER_ENDPOINTS = [
    ['PUT', `/api/listings/${listingStub().id}/like`],
    ['PUT', `/api/listings/${listingStub().id}/unlike`],
]

describe('ListingsController', () => {
    let dbConn: Connection
    let listingsCollection: Collection<Listing>
    let usersCollection: Collection<User>
    let httpServer: Server

    describe('when authenticated as admin', () => {
        beforeEach(async () => {
            httpServer = createTestClient(createHandler(ListingsController), adminUserPayloadStub())
            dbConn = await dbConnection()

            listingsCollection = dbConn.collection('listings')
            usersCollection = dbConn.collection('users')
        })

        beforeEach(async () => {
            await listingsCollection.deleteMany({})
            await usersCollection.deleteMany({})
            await usersCollection.insertOne(adminStub())
        })

        afterAll(() => {
            httpServer.close()
        })

        describe('POST /listings', () => {
            it('should return listing and create document', async () => {
                const dto: CreateListingDto = _.omit(listingStub(), '_id', 'id')
                const response = await request(httpServer).post('/api/listings').send(dto)

                expect(response.status).toBe(201)
                expect(response.body).toMatchObject({
                    ...transformDate(dto),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })

                const listing = await listingsCollection.findOne({
                    _id: new mongoose.Types.ObjectId(response.body._id),
                })
                expect(listing).toMatchObject({
                    ...dto,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            })
        })

        describe('DELETE /listings', () => {
            it('should return OK and delete document', async () => {
                await listingsCollection.insertOne(listingStub())

                const dto: DeleteListingsDto = {
                    origins: [listingStub().origin],
                }

                const response = await request(httpServer).del('/api/listings').send(dto)

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
                    .put('/api/listings/' + listingStub().id)
                    .send(dto)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(
                    transformDate({
                        ...listingStub(),
                        ...dto,
                        updatedAt: expect.any(String),
                    })
                )

                const listing = await listingsCollection.findOne({
                    _id: listingStub()._id,
                })
                expect(listing).toMatchObject({
                    ...listingStub(),
                    ...dto,
                    updatedAt: expect.any(Date),
                })
            })
        })

        describe('DELETE /listings/:id', () => {
            it('should return OK and delete document', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).del('/api/listings/' + listingStub().id)

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
            dbConn = await dbConnection()
            httpServer = createTestClient(createHandler(ListingsController), userPayloadStub())

            listingsCollection = dbConn.collection('listings')
            usersCollection = dbConn.collection('users')
        })

        beforeEach(async () => {
            await listingsCollection.deleteMany({})
            await usersCollection.deleteMany({})
            await usersCollection.insertOne(userStub())
        })

        afterAll(() => {
            httpServer.close()
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

                const response = await request(httpServer).put(
                    `/api/listings/${listingStub().id}/like`
                )

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
                await request(httpServer).put(`/api/listings/${listingStub().id}/like`)
                // unlike
                const response = await request(httpServer).put(
                    `/api/listings/${listingStub().id}/unlike`
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
            dbConn = await dbConnection()
            httpServer = createTestClient(createHandler(ListingsController))

            listingsCollection = dbConn.collection('listings')
            usersCollection = dbConn.collection('users')
        })

        beforeEach(async () => {
            await listingsCollection.deleteMany({})
            await usersCollection.deleteMany({})
        })

        afterAll(() => {
            httpServer.close()
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

                const response = await request(httpServer).get('/api/listings')

                expect(response.status).toBe(200)
                expect(response.body.totalHits).toBe(1)
                expect(response.body.hits).toMatchObject([transformDate(listingStub())])
            })
        })

        describe('GET /listings/featured', () => {
            it('should return listings', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).get('/api/listings/featured')

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([transformDate(listingStub())])
            })
        })

        describe('GET /listings/autocomplete/:keyword', () => {
            it('should return auto completions', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).get(
                    '/api/listings/autocomplete/' + _.take(listingStub().title, 4).join('')
                )

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([listingStub().title])
            })
        })

        describe('GET /listings/:id', () => {
            it('should return listing', async () => {
                await listingsCollection.insertOne(listingStub())

                const response = await request(httpServer).get('/api/listings/' + listingStub().id)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(transformDate(listingStub()))
            })
        })
    })
})
