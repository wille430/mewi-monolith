import type { TestingModuleBuilder } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { bootstrapApp } from '@/bootstrapApp'
import { DatabaseService } from '@/database/database.service'

export const initTestModule = async (
    overrideFactory: (builder: TestingModuleBuilder) => any = () => undefined
) => {
    const builder = Test.createTestingModule({
        imports: [AppModule],
    })
    overrideFactory(builder)
    const moduleRef = await builder.compile()

    const app = moduleRef.createNestApplication()
    bootstrapApp(app)
    await app.init()

    const dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle()
    const httpServer = app.getHttpServer()

    return {
        dbConnection,
        httpServer,
        app,
    }
}
