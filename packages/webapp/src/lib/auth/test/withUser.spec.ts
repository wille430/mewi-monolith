import { getMe } from '@/api/users'
import { GetServerSidePropsContext } from 'next'
import { getAccessToken } from '../getAccessToken'
import { addUserToRequest, withUser } from '../withUser'
import { contextStub } from './stubs/context.stub'

jest.mock('../getAccessToken')
jest.mock('@/api/users')

describe('withUser', () => {
    beforeEach(async () => {
        jest.restoreAllMocks()
    })

    describe('when withUser is called', () => {
        let result: any
        let handler: any

        beforeEach(async () => {
            handler = jest.fn()
            result = withUser(handler)
        })

        it('then it should return function', () => {
            expect(result).toBeInstanceOf(Function)
        })
    })

    describe('when return function of withUser is invoked', () => {
        let handler: any
        let context: GetServerSidePropsContext

        beforeEach(async () => {
            handler = jest.fn()
            context = contextStub()
            await addUserToRequest(context, handler)
        })

        it('then getMe should be called', () => {
            expect(getMe).toHaveBeenCalled()
        })

        it('then getAccessToken should be called', () => {
            expect(getAccessToken).toHaveBeenCalled()
        })

        it('then handler should be called', () => {
            expect(handler).toHaveBeenCalledWith(context)
        })

        it('then it should add user to request', () => {
            expect(context.req.user).toBeTruthy()
        })
    })
})
