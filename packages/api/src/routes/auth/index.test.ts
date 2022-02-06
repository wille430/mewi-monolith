import app from 'routes/app'
import request from 'supertest'
import { AuthErrorCodes, ValidationErrorCodes } from '@mewi/types'
import { randomString } from '@mewi/util'
import _ from 'lodash'

describe('auth', () => {
    describe('POST /auth/login', () => {
        describe('with invalid empty body', () => {
            let response

            beforeEach(async () => {
                response = await request(app).post('/auth/login')
            })

            it('should return 422 status code', () => {
                expect(response.statusCode).toBe(422)
            })

            it('should return with correct error type', () => {
                expect(response.body.error.type).toBe(ValidationErrorCodes.INVALID_INPUT)
            })
        })

        describe('with invalid credentials', () => {
            let response

            beforeEach(async () => {
                response = await request(app)
                    .post('/auth/login')
                    .send({
                        email: randomString(16),
                        password: randomString(16),
                    })
            })

            it('should return with 404 status code', () => {
                expect(response.statusCode).toBe(404)
            })

            it('should return with correct error type', () => {
                expect(
                    _.find(Object.values(AuthErrorCodes), (x) => x === response.body.error.type)
                ).toBeTruthy()
            })
        })
    })
})
