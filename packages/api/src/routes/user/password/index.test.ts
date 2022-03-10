import faker from '@faker-js/faker'
import { AuthErrorCodes } from '@mewi/types'
import app from 'routes/app'
import { AuthService, PasswordService } from 'services/UserServices'
import request from 'supertest'
import { randomEmail } from '@mewi/util'
import { v4 as uuidv4 } from 'uuid'

describe('password', () => {
    describe('PUT /user/password', () => {
        describe('when unauthorized', () => {
            let response

            beforeAll(async () => {
                response = await request(app).put('/user/password')
            })

            it('should return 401 response', () => {
                expect(response.statusCode).toBe(401)
            })

            it('should return with correct error type', () => {
                expect(response.body.error.type).toBe(AuthErrorCodes.MISSING_JWT)
            })
        })

        describe('when authorized', () => {
            let response
            let updatePassword

            beforeAll(async () => {
                updatePassword = jest.fn()
                PasswordService.updatePassword = jest.fn()

                // make request
                process.env.TOKEN_KEY = uuidv4()
                const token = await AuthService.createJWT(faker.datatype.uuid(), randomEmail())

                const headers = { Authorization: 'Bearer ' + token }

                const newPassword = '!Aa0' + faker.internet.password(6)
                const resetToken = faker.datatype.uuid()

                response = await request(app).put('/user/password').set(headers).send({
                    newPassword,
                    token: resetToken,
                })
            })

            it('should return with 200', () => {
                expect(response.statusCode).toBe(200)
            })
        })
    })

    describe('POST /user/password/reset', () => {
        describe('when unauthorized', () => {
            let response

            beforeAll(async () => {
                response = await request(app).post('/user/password/reset')
            })

            it('should return 401 response', () => {
                expect(response.statusCode).toBe(401)
            })

            it('should return with correct error type', () => {
                expect(response.body.error.type).toBe(AuthErrorCodes.MISSING_JWT)
            })
        })

        describe('when authorized', () => {
            let response

            beforeAll(async () => {
                // make request
                process.env.TOKEN_KEY = uuidv4()
                const token = await AuthService.createJWT(faker.datatype.uuid(), randomEmail())

                const headers = { Authorization: 'Bearer ' + token }

                response = await request(app)
                    .post('/user/password/reset')
                    .set(headers)
                    .send({ sendEmail: true })
            })

            it('should return with 200', () => {
                expect(response.statusCode).toBe(200)
            })
        })
    })
})
