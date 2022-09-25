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

describe('UsersController', () => {
    let dbConnection: Connection
    let httpServer: any
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(JwtAuthGuard)
            .useClass(JwtAuthGuardMock)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle()
        httpServer = app.getHttpServer()

        await dbConnection.collection('users').insertOne(adminStub())

        jest.resetAllMocks()
    })

    afterAll(async () => {
        await dbConnection.collection('users').deleteMany({})
        await app.close()
    })

    describe('GET /users', () => {
        it('should return an array of users', async () => {
            await dbConnection.collection('users').insertOne(userStub())
            const response = await request(httpServer).get('/users')

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject([adminStub(), userStub()])
        })
    })
})
