import faker from '@faker-js/faker'
import app from 'routes/app'
import { PasswordService, UserService } from 'services/UserServices'
import request from 'supertest'
import { generateMockUserData, randomEmail } from '@mewi/util'
import { v4 as uuidv4 } from 'uuid'
import { Types } from 'mongoose'
import EmailService from 'services/EmailService'

describe('password', () => {
    describe('PUT /auth/password', () => {
        let response
        let updatePassword

        beforeAll(async () => {
            const userId = new Types.ObjectId().toString()

            updatePassword = jest.fn(() => Promise.resolve())
            PasswordService.updatePassword = updatePassword

            // make request
            process.env.TOKEN_KEY = uuidv4()

            const newPassword = '!Aa0' + faker.internet.password(6)
            const resetToken = faker.datatype.uuid()

            response = await request(app).put('/auth/password').send({
                userId,
                newPassword,
                passwordConfirm: newPassword,
                token: resetToken,
            })
        })

        it('should return with 200', () => {
            expect(response.statusCode).toBe(200)
        })
    })

    describe('POST /auth/password/reset', () => {
        let response
        const createResetTokenMock = jest.fn(() => Promise.resolve(faker.datatype.uuid()))
        const getUserMock = jest
            .fn()
            .mockResolvedValue({ ...generateMockUserData(), save: jest.fn() })
        const sendEmailMock = jest.fn(() => Promise.resolve())

        beforeAll(async () => {
            const email = randomEmail()

            PasswordService.createResetToken = createResetTokenMock
            UserService.findUser = getUserMock
            EmailService.sendForgottenPasswordEmail = sendEmailMock

            // make request
            process.env.TOKEN_KEY = uuidv4()

            response = await request(app)
                .post('/auth/password/reset')
                .send({ email, sendEmail: true })
        })

        it('should return with 200', () => {
            expect(response.statusCode).toBe(200)
        })

        it('should call functions', () => {
            expect(createResetTokenMock).toBeCalled()
            expect(getUserMock).toBeCalled()
            expect(sendEmailMock).toBeCalled()
        })
    })
})
