import { randomEmail } from '@mewi/util'
import EmailService from './EmailService'

describe('Email Service', () => {
    it.todo('should be able to send email', async () => {
        const locals = {
            newItemCount: 100,
            keyword: 'test',
            items: [],
        }

        const email = await EmailService.sendEmail(
            randomEmail(),
            EmailService.newWatchersTemplatePath,
            locals,
            true
        )
        expect(email.response).toBeTruthy()
    })
})
