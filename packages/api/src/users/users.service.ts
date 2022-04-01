import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '@/users/user.schema'
import { Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from '@/users/dto/change-password.dto'
import { ObjectId } from 'mongodb'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)

        const newUser = new this.userModel(createUserDto)
        await newUser.save()

        return newUser
    }

    async findAll() {
        return await this.userModel.find({})
    }

    async findOne(id: string): Promise<UserDocument> {
        return this.userModel.findById(id)
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto)
        return await this.findOne(id)
    }

    async remove(id: string) {
        await this.userModel.deleteOne({ _id: new ObjectId(id) })
    }

    async changePassword(
        { password, passwordConfirm }: ChangePasswordAuth,
        userId?: string
    ): Promise<void> {
        if (password === passwordConfirm) {
            const newPasswordHash = await bcrypt.hash(password, 10)

            await this.userModel.updateOne(
                { _id: new ObjectId(userId) },
                { password: newPasswordHash }
            )

            return
        } else {
            throw new Error('Passwords must match')
        }
    }

    changePasswordWithToken({ password, passwordConfirm, token }: ChangePasswordWithToken) {
        return 'changing password with token...'
    }

    sendPasswordResetEmail({ email }: ChangePasswordNoAuth) {
        return 'sending reset email to ' + email
    }
}
