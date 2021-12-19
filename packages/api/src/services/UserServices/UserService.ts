import UserModel from "models/UserModel"
import { APIError, AuthErrorCodes } from "types/errorCodes"

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

    static async usersInIds(ids: string[]) {
        const users = UserModel.find({ _id: { $in: ids } })
        return users
    }
}