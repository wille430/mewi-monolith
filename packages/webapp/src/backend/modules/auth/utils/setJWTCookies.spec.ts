import faker from '@faker-js/faker'
import { setJWTCookies } from './setJWTCookies'
import { Response } from 'express'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@wille430/common'

export const responseStub = (): Response =>
    ({
        cookie: jest.fn(),
    } as unknown as Response)

describe('setJWTCookies', () => {
    describe('when setJWTCookies is called', () => {
        let response: Response
        let accessToken: string
        let refreshToken: string

        beforeEach(async () => {
            response = responseStub()
            accessToken = faker.random.alphaNumeric(32)
            refreshToken = faker.random.alphaNumeric(32)

            setJWTCookies(response, {
                access_token: accessToken,
                refresh_token: refreshToken,
            })
        })

        it('should call cookie method on response', () => {
            expect(response.cookie).toHaveBeenNthCalledWith(1, ACCESS_TOKEN_COOKIE, accessToken, {
                expires: expect.any(Date),
            })

            expect(response.cookie).toHaveBeenNthCalledWith(2, REFRESH_TOKEN_COOKIE, refreshToken, {
                expires: expect.any(Date),
            })
        })
    })
})
