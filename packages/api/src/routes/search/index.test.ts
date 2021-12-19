import request from 'supertest'
import app from '../app'

describe('search', () => {

    describe('GET /search', () => {

        describe('when database is up', () => {
            let response
            let body

            beforeEach(async () => {
                response = await request(app).get('/search')
                body = response.body
            })

            it('should respond with a 200 status code', async () => {
                expect(response.statusCode).toBe(200)
            })

            it('should specify json in the content type header', async () => {
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            })

            it('should return arary with items', async () => {
                expect(Array.isArray(response.body.hits)).toBe(true)
            })

            it('should return total hits', () => {
                expect(typeof response.body.totalHits === 'number').toBe(true)
            })
        })


        // describe('when database is down', () => {
        //     let response
        //     let body

        //     beforeEach(async () => {
        //         response = await request(app).get('/search')
        //         body = response.body
        //     })

        //     it('should respond with a 500 status code', async () => {
        //         expect(response.statusCode).toBe(500)
        //     })

        // })
    })

    describe('GET /search/:query', () => {

        let response
        let body
        const query = "volvo"

        beforeEach(async () => {
            response = await request(app).get(`/search/${query}`)
            body = response.body
        })

        it('should respond with a 200 status code', async () => {
            expect(response.statusCode).toBe(200)
        })

        it('should specify json in the content type header', async () => {
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })

        it('should return arary with items', async () => {
            expect(Array.isArray(body.hits)).toBe(true)
        })

        it('should return total hits', () => {
            expect(typeof body.totalHits === 'number').toBe(true)
        })

        it('should return object with query', () => {
            expect(body.query).toEqual(query)
        })

    })
})