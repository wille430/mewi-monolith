import UserModel, { User } from 'models/UserModel'
import { APIError, AuthErrorCodes, EditableUserFields, UserData, ValidationErrorCodes } from '@mewi/types'
import UserEmailService from './UserEmailService'

export default class UserService {
    static async user(userId: string, projection?: any) {
        const user = await UserModel.findById(userId, projection)

        if (!user) throw new APIError(404, AuthErrorCodes.MISSING_USER)

        return user
    }

    static async info(userId: string) {
        const user = await UserService.user(userId, { password: 0 })
        return user
    }

    static async usersInIds(ids: string[]): Promise<User[]> {
        const users = UserModel.find({ _id: { $in: ids } })
        return users
    }

    static async updateInfoField(
        userId: string,
        field: EditableUserFields,
        value: UserData[EditableUserFields]
    ) {
        const user = await await UserModel.findById(userId)
        if (!user) throw new APIError(404, AuthErrorCodes.MISSING_USER)

        if (field === 'email') {
            if (!UserEmailService.validate(value)) {
                throw new APIError(422, AuthErrorCodes.INVALID_EMAIL)
            }
        } else {
            throw new APIError(422, ValidationErrorCodes.INVALID_INPUT)
        }

        user[field] = value

        await user.save()

        return value
    }
}
