import { firstName, domainName, lastName } from 'minifaker'
import 'minifaker/locales/en'
import { randomString } from './stringUtils'

export const randomEmail = () => {
    return `${firstName()}.${lastName()}@${domainName()}`.toLowerCase()
}

export const randomPassword = () => {
    return '.Abc123' + randomString(10)
}
