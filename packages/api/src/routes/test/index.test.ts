import request from 'supertest'
import app from '../app'

describe('test', () => {
    describe('POST /test/user', () => {

        let response

        beforeEach(async () => {
            response = await request(app).post('/test/user')
        })

        it('should return 201 status code', () => {
            expect(response.statusCode).toBe(201)
        })

        it('should return token in body', () => {
            expect(response.text).toMatch(/([\w-]*\.[\w-]*\.[\w-]*)/g)
        })

    })
})