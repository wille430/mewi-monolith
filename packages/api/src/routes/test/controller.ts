import { AuthService } from '../../services/UserServices'
import { randomString } from '@mewi/util'

export const createTestUser = async (req, res, next) => {

    const email = randomString(10) + "@removeme.com"
    const password = '.' + randomString(10) + 'A123'

    const authTokens = await AuthService.signUp(email, password, password).catch(next)

    res.status(201).send({
        ...authTokens,
        email: email,
        password: password
    })
}