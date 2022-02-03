import request from 'supertest'
import app from '../app'

describe('search', () => {
    describe('GET /search', () => {
        describe('when database is up', () => {
            let response

            beforeEach(async () => {
                response = await request(app).get('/search')
            })

            it('should respond with a 200 status code', async () => {
                expect(response.statusCode).toBe(200)
            })

            it('should return arary with items', async () => {
                expect(Array.isArray(response.body.hits)).toBe(true)
            })

            it('should return total hits', () => {
                expect(typeof response.body.totalHits === 'number').toBe(true)
            })
        })
    })

    describe('POST /search', () => {
        let response
        let body
        const query = 'volvo'

        beforeEach(async () => {
            response = await request(app)
                .post(`/search`)
                .send({
                    searchFilters: {
                        keyword: query,
                    },
                })
            body = response.body
        })

        it('should respond with a 200 status code', async () => {
            expect(response.statusCode).toBe(200)
        })

        it('should return arary with items', () => {
            expect(Array.isArray(body.hits)).toBe(true)
        })

        it('should return total hits', () => {
            expect(typeof body.totalHits === 'number').toBe(true)
        })
    })
})
