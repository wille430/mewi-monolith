import request from 'supertest'
import { SearchFilterDataProps } from '@mewi/types'
import app from '../../app'
import { randomString } from '@mewi/util'

describe('user watchers', () => {
    let headers

    beforeAll(async () => {
        const token = await request(app)
            .post('/test/user')
            .then((res) => res.body.jwt)

        headers = { Authorization: 'Bearer ' + token }
    })

    describe('POST /user/watchers', () => {
        describe('with invalid body', () => {
            let response

            beforeAll(async () => {
                response = await request(app).post('/user/watchers').set(headers)
            })

            it('should return with 422 status code', () => {
                expect(response.statusCode).toBe(422)
            })
        })

        describe('with valid body', () => {
            let response

            beforeAll(async () => {
                const searchFilters: SearchFilterDataProps = {
                    keyword: 'BMW',
                }

                const reqBody = {
                    searchFilters,
                }

                response = await request(app).post('/user/watchers').send(reqBody).set(headers)
            })

            it('should return with 201 status code', () => {
                expect(response.statusCode).toBe(201)
            })

            it('should return with the new watcher', () => {
                expect(response.body.watcher).toBeTruthy()
            })
        })
    })

    describe('GET /user/watchers', () => {
        let response

        beforeAll(async () => {
            response = await request(app).get('/user/watchers').set(headers)
        })

        it('should return status code 200', () => {
            expect(response.statusCode).toBe(200)
        })

        it('should return with array in body', () => {
            expect(Array.isArray(response.body.watchers)).toBe(true)
        })
    })

    describe('PATCH /user/watchers', () => {
        let response
        const newKeyword = randomString(20)

        beforeAll(async () => {
            const searchFilters: SearchFilterDataProps = {
                keyword: randomString(10),
            }

            const reqBody = {
                searchFilters,
            }

            const watcher = await request(app)
                .post('/user/watchers')
                .send(reqBody)
                .set(headers)
                .then((res) => res.body.watcher)

            const watcherId = watcher._id

            const newSearchFilters: SearchFilterDataProps = {
                keyword: newKeyword,
            }

            response = await request(app)
                .patch('/user/watchers/' + watcherId)
                .send({
                    searchFilters: newSearchFilters,
                })
                .set(headers)
        })

        it('should return 201 status code', () => {
            expect(response.statusCode).toBe(201)
        })

        it('should return an object', () => {
            expect(response.body.watcher).toBeTruthy()
        })

        it('should return updated watcher', () => {
            expect(response.body.watcher.metadata).toEqual({
                keyword: newKeyword,
            })
        })
    })

    // describe('DELETE /user/watchers', () => {

    //     let response

    //     beforeAll(async () => {
    //         response = await request(app).delete('/user/watchers').set(headers)
    //     })

    // })
})
