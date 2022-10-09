import { Role } from '@wille430/common'
import { withAuth } from '../withAuth'
import faker from '@faker-js/faker'
import { contextStub } from './stubs/context.stub'
import { userStub } from '@mewi/test-utils'
import _ from 'lodash'

jest.mock('../withUser')

describe('withAuth', () => {
    let handler: any
    let allowedRoles: Role[]

    beforeEach(() => {
        handler = jest.fn()
        allowedRoles = faker.helpers.arrayElements(Object.values(Role))
    })

    describe('when withAuth is called', () => {
        let func: any

        beforeEach(() => {
            func = withAuth(handler, allowedRoles)
        })

        it('should return a function', () => {
            expect(typeof func).toBe('function')
        })
    })

    describe('when return function of withAuth is called', () => {
        let obj: any

        describe('with valid role', () => {
            beforeEach(async () => {
                obj = await withAuth(
                    handler,
                    _.union(allowedRoles, userStub().roles)
                )(contextStub())
            })

            it('then it should return object', () => {
                expect(obj).toBe(handler())
            })
        })

        describe('without a valid role', () => {
            beforeEach(async () => {
                obj = await withAuth(
                    handler,
                    _.difference(allowedRoles, userStub().roles)
                )(contextStub())
            })

            it('then it should return object', () => {
                expect(typeof obj).toBe('object')
                expect(obj.redirect).toBeTruthy()
            })
        })
    })
})
