import app from 'routes/app'
import request from 'supertest'
import { AuthErrorCodes, ValidationErrorCodes } from '@mewi/types'
import { randomEmail, randomString } from '@mewi/util'
import faker from '@faker-js/faker'
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
                        password: '.a123/' + randomString(16),
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

        describe('with valid credentials', () => {
            let response

            beforeEach(async () => {
                // create test user
                const { email, password } = await request(app)
                    .post('/test/user')
                    .then((res) => res.body)

                response = await request(app).post('/auth/login').send({
                    email,
                    password,
                })
            })

            it('should return with 200 status code', () => {
                expect(response.statusCode).toBe(200)
            })

            it('should return jwt and refresh token', () => {
                expect(typeof response.body.jwt).toBe('string')
                expect(typeof response.body.refreshToken).toBe('string')
            })
        })
    })

    describe('POST /auth/signup', () => {
        describe('with invalid empty body', () => {
            let response

            beforeEach(async () => {
                response = await request(app).post('/auth/signup')
            })

            it('should return 422 status code', () => {
                expect(response.statusCode).toBe(422)
            })

            it('should return with correct error type', () => {
                expect(response.body.error.type).toBe(ValidationErrorCodes.INVALID_INPUT)
            })
        })

        describe('with too short password', () => {
            let response

            beforeEach(async () => {
                const email = randomEmail()
                const password = faker.internet.password(6)

                response = await request(app).post('/auth/signup').send({
                    email: email,
                    password: password,
                    repassword: password,
                })
            })

            it('should return with 422 status code', () => {
                expect(response.statusCode).toBe(422)
            })

            it('should return with correct error type', () => {
                expect(response.body.error.type).toBe(AuthErrorCodes.PASSWORD_NOT_STRONG_ENOUGH)
            })
        })

        describe('with invalid email', () => {
            let response

            beforeEach(async () => {
                const email = randomString(12)
                const password = '.' + faker.internet.password() + '123'

                response = await request(app).post('/auth/signup').send({
                    email: email,
                    password: password,
                    repassword: password,
                })
            })

            it('should return with 422 status code', () => {
                expect(response.statusCode).toBe(422)
            })

            it('should return with correct error type', () => {
                expect(response.body.error.type).toBe(AuthErrorCodes.INVALID_EMAIL)
            })
        })

        describe('with valid credentials', () => {
            let response

            beforeEach(async () => {
                const email = randomEmail()
                const password = '.' + faker.internet.password() + '123'

                response = await request(app).post('/auth/signup').send({
                    email: email,
                    password: password,
                    repassword: password,
                })
            })

            it('should return with 201 status code', () => {
                expect(response.statusCode).toBe(201)
            })

            it('should return jwt and refresh token', () => {
                expect(typeof response.body.jwt).toBe('string')
                expect(typeof response.body.refreshToken).toBe('string')
            })
        })
    })
})
