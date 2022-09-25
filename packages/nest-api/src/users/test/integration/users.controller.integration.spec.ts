import { AppModule } from '@/app.module'
import { DatabaseService } from '@/database/database.service'
import { Test } from '@nestjs/testing'
import { Connection } from 'mongoose'
import { userStub } from '../stubs/user.stub'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { JwtAuthGuard as JwtAuthGuardMock } from '@/auth/test/support/jwt-auth.guard'
import { adminStub } from '../stubs/admin.stub'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import faker from '@faker-js/faker'
import { bootstrapApp } from '@/bootstrapApp'

describe('UsersController', () => {
    let dbConnection: Connection
    let httpServer: any
    let app: INestApplication

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        await dbConnection.collection('users').deleteMany({})
    })

    describe('when authenticated', () => {
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [AppModule],
            })
                .overrideGuard(JwtAuthGuard)
                .useClass(JwtAuthGuardMock)
                .compile()

            app = moduleRef.createNestApplication()
            bootstrapApp(app)
            await app.init()
            dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle()
            httpServer = app.getHttpServer()

            jest.resetAllMocks()
        })

        beforeEach(async () => {
            await dbConnection.collection('users').insertOne(adminStub())
        })

        describe('GET /users', () => {
            it('should return an array of users', async () => {
                await dbConnection.collection('users').insertOne(userStub())
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
                const user = await dbConnection.collection('users').findOne({
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
    })

    describe('when unauthenticated', () => {
        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [AppModule],
            }).compile()

            app = moduleRef.createNestApplication()
            await app.init()
            dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle()
            httpServer = app.getHttpServer()

            jest.resetAllMocks()
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
    })
})
