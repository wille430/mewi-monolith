import { AuthErrorCodes } from '@mewi/types'
import request from 'supertest'
import app from '../app'

describe('user', () => {
    describe('GET /user', () => {
        describe('when authorized', () => {
            let response

            beforeEach(async () => {
                response = await request(app).get('/user')
            })

            it('should return 401', () => {
                expect(response.statusCode).toBe(401)
            })

            it('should return error object with missing JWT error', () => {
                console.log(response.body)
                expect(response.body.error).toBeTruthy()
                expect(response.body.error.type).toBe(AuthErrorCodes.MISSING_JWT)
            })
        })

        describe('when authorized', () => {
            let response

            beforeEach(async () => {
                const token = await request(app)
                    .post('/test/user')
                    .then((res) => res.text)

                response = await request(app)
                    .post('/user')
                    .set({ Authorization: 'Bearer ' + token })
            })

            it('should respond with 200 status code', () => {
                expect(response.statusCode).toBe(200)
            })

            it('should return with an object', () => {
                expect(typeof response.body).toMatch('object')
            })
        })
    })
})
