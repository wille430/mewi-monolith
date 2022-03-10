import faker from '@faker-js/faker'
import { generateMockUserData } from '@mewi/util'
import UserModel from 'models/UserModel'
import PasswordService from './PasswordService'

describe('Password Service', () => {
    let save = jest.fn()

    beforeAll(() => {
        save = jest.fn()
        UserModel.findById = jest.fn().mockReturnValue({ ...generateMockUserData(), save })
    })

    it('should create token for password reset', async () => {
        const resetToken = await PasswordService.createResetToken(faker.datatype.uuid())

        console.log('TOKEN:', resetToken)
        expect(resetToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    })

    it.todo('should send email with password reset redirect')

    it.todo('should validate token')

    it.todo('should change update password')
})
