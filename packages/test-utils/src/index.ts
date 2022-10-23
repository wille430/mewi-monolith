import { randomString } from '@wille430/common'
import { faker } from '@faker-js/faker'
import _ from 'lodash'

export * from './factory'
export * from './stubs'
export * from './seed'

export const randomEmail = () => {
    return `${faker.name.firstName()}.${faker.name.lastName()}@${faker.internet.domainName()}`.toLowerCase()
}

export const randomPassword = () => {
    return '.Abc123' + randomString(10)
}

export const randomSample = <T>(arr: T[], min?: number): T[] => {
    return _.sampleSize(
        arr,
        faker.datatype.number({
            min: 2,
            max: arr.length,
        })
    )
}
