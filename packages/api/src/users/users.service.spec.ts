import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User, UserDocument, UserSchema } from './user.schema'
import { UsersService } from './users.service'
import { Model } from 'mongoose'
import { factory } from 'fakingoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { randomEmail, randomPassword } from '@wille430/common'
import { ChangePasswordAuth } from './dto/change-password.dto'
import { CreateUserDto } from './dto/create-user.dto'

describe('UsersService', () => {
    let usersService: UsersService
    let mongod: MongoMemoryServer
    let userModel: Model<UserDocument>
    const userFactory = factory(UserSchema, {}).setGlobalObjectIdOptions({
        tostring: false,
    })

    let user: UserDocument

    beforeAll(async () => {
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

        usersService = module.get<UsersService>(UsersService)
        userModel = module.get<Model<UserDocument>>(getModelToken(User.name))
    })

    beforeEach(async () => {
        const mockUser = userFactory.generate()
        user = await userModel.create(mockUser)
        await user.save()
    })

    afterEach(() => {
        userModel.remove({})
    })

    it('should be defined', () => {
        expect(usersService).toBeDefined()
    })

    describe('#create', () => {
        it('should create new user and return it', async () => {
            const createUserDto: CreateUserDto = {
                email: randomEmail(),
                password: randomPassword(),
            }

            const newUser = await usersService.create(createUserDto)

            expect(newUser).toHaveProperty('email', createUserDto.email)
            expect(newUser).toHaveProperty('premium', false)
            expect(newUser).toHaveProperty('watchers', [])
            expect(newUser).toHaveProperty('passwordResetSecret')
        })
    })

    describe('#findAll', () => {
        it('should return an array of users', async () => {
            expect(await usersService.findAll()).toEqual(await userModel.find({}))
        })
    })

    describe('#findOne', () => {
        it('should return one user', async () => {
            expect(await usersService.findOne(user._id)).toBeInstanceOf(Object)
        })
    })

    describe('#update', () => {
        it('should return updated user', async () => {
            const updateUserDto: UpdateUserDto = { email: randomEmail() }
            const updatedUser = await usersService.update(user._id, updateUserDto)

            expect(updatedUser).toHaveProperty('email', updateUserDto.email)
        })
    })

    describe('#remove', () => {
        it('should remove user', async () => {
            expect(await usersService.findOne(user._id)).toBeTruthy()

            await usersService.remove(user._id)

            expect(await usersService.findOne(user._id)).toBeNull()
        })
    })

    describe('#changePassword', () => {
        it('should update password for user', async () => {
            const changePasswordDto: ChangePasswordAuth = {
                password: randomPassword(),
                passwordConfirm: '',
            }
            changePasswordDto.passwordConfirm = changePasswordDto.password

            const originalPassHash = user.password

            await usersService.changePassword(changePasswordDto, user._id)

            expect(
                (await userModel.findOne({ _id: user._id }, { password: 1 })).password
            ).not.toEqual(originalPassHash)
        })
    })
})
