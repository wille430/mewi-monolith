import { randomEmail } from '@mewi/common'
import EmailService from './EmailService'

describe('Email Service', () => {
    it.skip('should be able to send email', async () => {
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
