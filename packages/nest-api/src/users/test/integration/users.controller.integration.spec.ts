import { AppModule } from '@/app.module'
import { DatabaseService } from '@/database/database.service'
import { Test } from '@nestjs/testing'
import { Collection, Connection } from 'mongoose'
import { userStub } from '../stubs/user.stub'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { JwtAuthGuard, OptionalJwtAuthGuard } from '@/auth/jwt-auth.guard'
import { createJwtAuthGuard, createOptionalJwtAuthGuard } from '@/auth/test/support/jwt-auth.guard'
import { adminStub } from '../stubs/admin.stub'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import faker from '@faker-js/faker'
import { bootstrapApp } from '@/bootstrapApp'
import { User } from '@/schemas/user.schema'
import { AuthorizedUpdateEmailDto, RequestEmailUpdateDto } from '@/users/dto/update-email.dto'
import { adminUserPayloadStub } from '../stubs/admin-user-payload.stub'
import { userPayloadStub } from '../stubs/user-payload.stub'
import ChangePasswordDto, {
    ChangePasswordAuth,
    ChangePasswordWithToken,
} from '@/users/dto/change-password.dto'
import * as bcrypt from 'bcryptjs'

describe('UsersController', () => {
    let dbConnection: Connection
    let usersCollection: Collection<User>
    let httpServer: any
    let app: INestApplication

    describe('when authenticated', () => {
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [AppModule],
            })
                .overrideGuard(JwtAuthGuard)
                .useClass(createJwtAuthGuard(adminUserPayloadStub()))
                .overrideGuard(OptionalJwtAuthGuard)
                .useClass(createOptionalJwtAuthGuard(userPayloadStub()))
                .compile()

            app = moduleRef.createNestApplication()
            bootstrapApp(app)
            await app.init()

            dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle()
            usersCollection = dbConnection.collection('users')

            httpServer = app.getHttpServer()

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
                expect(response.body).toMatchObject([adminStub(), userStub()])
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
                expect(adminStub()).toMatchObject(response.body)
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
    })

    describe('when unauthenticated', () => {
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [AppModule],
            }).compile()

            app = moduleRef.createNestApplication()
            await app.init()

            dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle()
            usersCollection = dbConnection.collection('users')

            httpServer = app.getHttpServer()

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
    })
})
