import faker from '@faker-js/faker'
import { AuthErrorCodes, UserData } from '@mewi/types'
import { generateMockUserData } from '@mewi/util'
import UserModel from 'models/UserModel'
import PasswordService from './PasswordService'

describe('Password Service', () => {
    let save = jest.fn()
    let userData: UserData

    beforeAll(() => {
        save = jest.fn()

        userData = generateMockUserData()

        UserModel.findById = jest.fn().mockReturnValue({ ...userData, save })
    })

    it('should create token for password reset', async () => {
        const resetToken = await PasswordService.createResetToken(userData._id)

        expect(resetToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    })

    it('should change update password with valid token', async () => {
        const resetToken = await PasswordService.createResetToken(userData._id)
        const newPassword = '!Aa0' + faker.internet.password(6)

        await PasswordService.updatePassword(userData.email, newPassword, newPassword, resetToken)
        expect(save).toBeCalledTimes(1)

        // TODO: CHECK SO THAT A NEW SECRET IS CREATED
    })

    it('should error when trying to update password with invalid token', async () => {
        const resetToken = faker.datatype.uuid()
        const newPassword = '!Aa0' + faker.internet.password(6)

        try {
            await PasswordService.updatePassword(userData._id, newPassword, newPassword, resetToken)
            fail()
        } catch (e) {
            expect(e.type).toBe(AuthErrorCodes.INVALID_JWT)
        }
    })
})
