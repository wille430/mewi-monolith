import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '@/users/user.schema'
import { Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '@mewi/common/types'
import {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from '@/users/dto/change-password.dto'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
        const newUser = new this.userModel(createUserDto)
        return newUser.save()
    }

    findAll() {
        // TODO
        return `This action returns all users`
    }

    async findOne(id: number): Promise<IUser> {
        return this.userModel.findById(id)
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        // TODO: return updated user?
        this.userModel.updateOne({ _id: id }, updateUserDto)
    }

    remove(id: number) {
        this.userModel.deleteOne({ _id: id })
    }

    changePassword({ password, passwordConfirm }: ChangePasswordAuth, userId?: string) {
        return 'changing password with for user ' + userId
    }

    changePasswordWithToken({ password, passwordConfirm, token }: ChangePasswordWithToken) {
        return 'changing password with token...' 
    }

    sendPasswordResetEmail({ email }: ChangePasswordNoAuth) {
        return 'sending reset email to ' + email
    }
}
