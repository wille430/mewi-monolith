import { getModelToken, MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { User, UserDocument, UserSchema } from './user.schema'
import { UsersModule } from './users.module'
import { Model } from 'mongoose'
import { INestApplication } from '@nestjs/common'
import { factory } from 'fakingoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'

describe('UsersController', () => {
    let userModel: Model<UserDocument>
    let app: INestApplication
    const userFactory = factory<UserDocument>(UserSchema, {}).setGlobalObjectIdOptions({
        tostring: false,
    })

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        const mongod = new MongoMemoryServer()
                        const uri = await mongod.getUri()
                        return {
                            uri,
                        }
                    },
                }),
                UsersModule,
            ],
        }).compile()

        app = module.createNestApplication()
        userModel = module.get<Model<UserDocument>>(getModelToken(User.name))
        await app.init()
    })

    beforeEach(() => {
        const mockUser = userFactory.generate()
        return userModel.create(mockUser)
    })

    afterEach(() => {
        userModel.remove()
    })

    it('GET /users', () => {
        return request(app.getHttpServer()).get('/users').expect(401)
    })

    afterAll(async () => {
        await app.close()
    })
})
