import type { Collection, Connection } from 'mongoose'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import faker from '@faker-js/faker'
import * as bcrypt from 'bcryptjs'
import { userStub } from '../stubs/user.stub'
import { adminStub } from '../stubs/admin.stub'
import { adminUserPayloadStub } from '../stubs/admin-user-payload.stub'
import { userPayloadStub } from '../stubs/user-payload.stub'
import { JwtAuthGuard, OptionalJwtAuthGuard } from '@/auth/jwt-auth.guard'
import { createJwtAuthGuard, createOptionalJwtAuthGuard } from '@/auth/test/support/jwt-auth.guard'
import type { CreateUserDto } from '@/users/dto/create-user.dto'
import type { User } from '@/schemas/user.schema'
import type { AuthorizedUpdateEmailDto, RequestEmailUpdateDto } from '@/users/dto/update-email.dto'
import type {
    ChangePasswordAuth,
    ChangePasswordWithToken,
} from '@/users/dto/change-password.dto'
import type ChangePasswordDto from '@/users/dto/change-password.dto'
import type { UpdateUserDto } from '@/users/dto/update-user.dto'
import { initTestModule } from '@/common/test/initTestModule'
import { transformDate } from '@/listings/helpers/transform-dates'
import { listingStub } from '@/listings/test/stubs/listing.stub'
import type { Listing } from '@/schemas/listing.schema'

describe('UsersController', () => {
    let dbConnection: Connection
    let usersCollection: Collection<User>
    let listingsCollection: Collection<Listing>
    let httpServer: any
    let app: INestApplication

    describe('when authenticated', () => {
        beforeAll(async () => {
            const testModule = await initTestModule((builder) => {
                builder
                    .overrideGuard(JwtAuthGuard)
                    .useClass(createJwtAuthGuard(adminUserPayloadStub()))
                    .overrideGuard(OptionalJwtAuthGuard)
                    .useClass(createOptionalJwtAuthGuard(userPayloadStub()))
            })
            dbConnection = testModule.dbConnection
            httpServer = testModule.httpServer
            app = testModule.app
            usersCollection = dbConnection.collection('users')
            listingsCollection = dbConnection.collection('listings')

            jest.resetAllMocks()
        })

        afterAll(async () => {
            await app.close()
        })

        beforeEach(async () => {
            await usersCollection.deleteMany({})
            await usersCollection.insertOne(adminStub())
        })

        describe('GET /users', () => {
            it('should return an array of users', async () => {
                await usersCollection.insertOne(userStub())
                const response = await request(httpServer).get('/users')

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject([
                    transformDate(adminStub()),
                    transformDate(userStub()),
                ])
            })
        })

        describe('POST /users', () => {
            it('should create a user', async () => {
                const createUserDto: CreateUserDto = {
                    email: userStub().email.toUpperCase(),
                    password: faker.internet.password(),
                }
                const res = await request(httpServer).post('/users').send(createUserDto)

                expect(res.status).toBe(201)
                expect(res.body).toMatchObject({
                    email: createUserDto.email.toLowerCase(),
                })

                // Assert that the user was created
                const user = await usersCollection.findOne({
                    email: createUserDto.email.toLowerCase(),
                })

                // Password will never the same as input
                expect(user).toMatchObject({
                    email: createUserDto.email.toLowerCase(),
                })
                expect(user?.password).not.toBe(createUserDto.password)
            })

            describe('with malformed input data', () => {
                it('then it should return error obj', async () => {
                    const malformedInput: Partial<CreateUserDto> = {
                        email: userStub().email,
                    }

                    const response = await request(httpServer).post('/users').send(malformedInput)
                    expect(response.status).toBe(400)
                })
            })
        })

        describe('GET /users/me', () => {
            it('should return user', async () => {
                const response = await request(httpServer).get('/users/me')

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(transformDate(adminStub()))
            })
        })

        // TODO: test post
        describe('PUT /users/email', () => {
            describe('with oldEmail and token', () => {
                let newEmail: string
                let token: string

                beforeEach(async () => {
                    // Request email change first
                    newEmail = faker.internet.email().toLowerCase()
                    await dbConnection.collection<User>('users').insertOne(userStub())

                    await request(httpServer).put('/users/email').send({
                        newEmail,
                    })
                })

                it('then it should return OK and update user', async () => {
                    const updatedUser = await dbConnection.collection<User>('users').findOne({
                        id: userStub().id,
                    })
                    token = updatedUser!.emailUpdate!.tokenHash

                    const updateEmailDto: AuthorizedUpdateEmailDto = {
                        token: token,
                        oldEmail: userStub().email,
                    }
                    const response = await request(httpServer)
                        .put('/users/email')
                        .send(updateEmailDto)

                    expect(response.status).toBe(200)

                    const user = await dbConnection.collection<User>('users').findOne({
                        id: userStub().id,
                    })
                    expect(user?.email).toBe(newEmail)
                })
            })

            describe('with newEmail', () => {
                // TODO: check for sent email
                it('then it should return OK and update user', async () => {
                    await dbConnection.collection<User>('users').insertOne(userStub())

                    const verifyEmailDto: RequestEmailUpdateDto = {
                        newEmail: faker.internet.email(),
                    }
                    const response = await request(httpServer)
                        .put('/users/email')
                        .send(verifyEmailDto)

                    expect(response.status).toBe(200)

                    const user = await dbConnection.collection<User>('users').findOne({
                        email: userStub().email,
                    })
                    const { emailUpdate } = user!

                    expect(emailUpdate?.expiration.getTime()).toBeGreaterThan(Date.now())
                    expect(emailUpdate?.newEmail).toBe(verifyEmailDto.newEmail?.toLowerCase())
                    expect(emailUpdate?.tokenHash).toEqual(expect.any(String))
                })
            })
        })

        describe('PUT /users/password', () => {
            beforeEach(async () => {
                await dbConnection.collection<User>('users').insertOne(userStub())
            })

            describe('with password and passwordConfirm (authenticated)', () => {
                it('should return OK and update user', async () => {
                    const originalUser = await dbConnection
                        .collection<User>('users')
                        .findOne({ id: userStub().id })
                    const oldPassHash = originalUser?.password

                    const newPassword = faker.internet.password()
                    const changePasswordAuthDto: ChangePasswordAuth = {
                        password: newPassword,
                        passwordConfirm: newPassword,
                    }

                    const response = await request(httpServer)
                        .put('/users/password')
                        .send(changePasswordAuthDto)

                    expect(response.status).toBe(200)

                    const user = await dbConnection
                        .collection<User>('users')
                        .findOne({ id: userStub().id })

                    expect(user?.password).not.toBe(oldPassHash)
                })
            })

            describe('with email', () => {
                it('should send email and update user', async () => {
                    const changePasswordDto: ChangePasswordDto = {
                        email: userStub().email,
                    }

                    const response = await request(httpServer)
                        .put('/users/password')
                        .send(changePasswordDto)

                    expect(response.status).toBe(200)

                    const user = await usersCollection.findOne({
                        id: userStub().id,
                    })

                    expect(user?.passwordReset).toMatchObject({
                        tokenHash: expect.any(String),
                        expiration: expect.any(Number),
                    })

                    // TODO: assert email was sent
                })
            })
        })

        describe('GET /users/:id', () => {
            it('should return user', async () => {
                await usersCollection.insertOne(userStub())
                const response = await request(httpServer).get(`/users/${userStub().id}`)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(transformDate(userStub()))
            })
        })

        describe('PUT /users/:id', () => {
            it('should return user and update document', async () => {
                await usersCollection.insertOne(userStub())

                const dto: UpdateUserDto = {
                    email: faker.internet.email().toLowerCase(),
                }
                const response = await request(httpServer).put(`/users/${userStub().id}`).send(dto)
                const newUser = await usersCollection.findOne({
                    id: userStub().id,
                })

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(transformDate(newUser!))
            })
        })

        describe('DELETE /users/:id', () => {
            it('should return user and remove document', async () => {
                await usersCollection.insertOne(userStub())

                const response = await request(httpServer).delete(`/users/${userStub().id}`)

                expect(response.status).toBe(200)
                expect(response.body).toMatchObject(transformDate(userStub()))

                const user = await usersCollection.findOne({
                    id: userStub().id,
                })

                expect(user).toBe(null)
            })
        })

        describe('GET /users/me/likes', () => {
            it('should return listings', async () => {
                await usersCollection.insertOne(userStub())
                await listingsCollection.insertOne(listingStub())
                await request(httpServer).put(`/listings/${listingStub().id}/like`)

                const res = await request(httpServer).get('/users/me/likes')

                expect(res.status).toBe(200)
                expect(res.body).toMatchObject([transformDate(listingStub())])
            })
        })
    })

    describe('when unauthenticated', () => {
        beforeAll(async () => {
            const testModule = await initTestModule()

            dbConnection = testModule.dbConnection
            httpServer = testModule.httpServer
            app = testModule.app
            usersCollection = dbConnection.collection('users')

            jest.resetAllMocks()
        })

        afterAll(async () => {
            await app.close()
        })

        beforeEach(async () => {
            await usersCollection.deleteMany({})
            await usersCollection.insertOne(adminStub())
        })

        describe('GET /users', () => {
            it('should return status 401', async () => {
                const response = await request(httpServer).get('/users')
                expect(response.status).toBe(401)
            })
        })

        describe('POST /users', () => {
            it('should return status 401', async () => {
                const response = await request(httpServer).post('/users')
                expect(response.status).toBe(401)
            })
        })

        describe('PUT /users/password', () => {
            let tokenHash: string
            let password: string

            beforeEach(async () => {
                tokenHash = faker.random.alphaNumeric(32)
                password = faker.internet.password(16, true)

                await usersCollection.insertOne({
                    ...userStub(),
                    password: await bcrypt.hash(password, 10),
                    passwordReset: {
                        expiration: Date.now() + 999999,
                        tokenHash,
                    },
                })
            })

            describe('with invalid token', () => {
                it('should return status 400', async () => {
                    const response = await request(httpServer)
                        .put('/users/password')
                        .send({
                            email: userStub().email,
                            password: userStub().password,
                            passwordConfirm: userStub().password,
                            token: faker.random.alphaNumeric(32),
                        } as ChangePasswordWithToken)

                    expect(response.status).toBe(400)
                })
            })

            describe('with same password as before', () => {
                it('should return status 400', async () => {
                    const response = await request(httpServer)
                        .put('/users/password')
                        .send({
                            email: userStub().email,
                            password: password,
                            passwordConfirm: password,
                            token: tokenHash,
                        } as ChangePasswordWithToken)

                    expect(response.status).toBe(400)
                })
            })
        })

        describe('GET /users/:id', () => {
            it('should return status 401', async () => {
                const response = await request(httpServer).get(`/users/${userStub().id}`)

                expect(response.status).toBe(401)
            })
        })

        describe('PUT /users/:id', () => {
            it('should return status 401', async () => {
                const response = await request(httpServer).put(`/users/${userStub().id}`)

                expect(response.status).toBe(401)
            })
        })

        describe('DELETE /users/:id', () => {
            it('should return status 401', async () => {
                const response = await request(httpServer).delete(`/users/${userStub().id}`)

                expect(response.status).toBe(401)
            })
        })

        describe('GET /users/me/likes', () => {
            it('should return status 401', async () => {
                const response = await request(httpServer).get(`/users/me/likes`)
                expect(response.status).toBe(401)
            })
        })
    })
})
