import type { INestApplication } from '@nestjs/common'
import type { Collection, Connection } from 'mongoose'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { createJwtAuthGuard } from '@/auth/test/support/jwt-auth.guard'
import { initTestModule } from '@/common/test/initTestModule'
import type { User } from '@/schemas/user.schema'
import { adminUserPayloadStub } from '@/users/test/stubs/admin-user-payload.stub'
import { adminStub } from '@/users/test/stubs/admin.stub'

describe('ScrapersController', () => {
    let dbConnection: Connection
    let usersCollection: Collection<User>
    let httpServer: any
    let app: INestApplication

    beforeAll(async () => {
        const testModule = await initTestModule((builder) => {
            builder.overrideGuard(JwtAuthGuard).useClass(createJwtAuthGuard(adminUserPayloadStub()))
        })
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

    it('should be defined', () => {})
})
