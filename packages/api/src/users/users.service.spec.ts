import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User, UserDocument, UserSchema } from './user.schema'
import { UsersService } from './users.service'
import { Model } from 'mongoose'
import { factory } from 'fakingoose'

describe('UsersService', () => {
    let service: UsersService
    let mongod: MongoMemoryServer
    let userModel: Model<UserDocument>
    const userFactory = factory(UserSchema, {}).setGlobalObjectIdOptions({
        tostring: false,
    })

    beforeEach(async () => {
        mongod = await MongoMemoryServer.create()

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        const uri = mongod.getUri()
                        return {
                            uri: uri,
                        }
                    },
                }),
                MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
            ],
            providers: [UsersService],
        }).compile()

        service = module.get<UsersService>(UsersService)
        userModel = module.get<Model<UserDocument>>(getModelToken(User.name))
    })

    beforeEach(async () => {
        const mockUser = userFactory.generate()
        const user = await userModel.create(mockUser)
        return user.save()
    })

    afterEach(() => {
        userModel.remove({})
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('#findAll', () => {})
})
