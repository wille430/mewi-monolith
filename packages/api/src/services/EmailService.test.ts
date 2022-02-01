import EmailService from './EmailService'
import dotenv from 'dotenv'

describe('Email Service', () => {
    it('should be able to send email',  async () => {
        const locals = {
            newItemCount: 100,
            keyword: 'test',
            items: [],
        }

        const email = await EmailService.sendEmail('wille430@gmail.com', EmailService.newWatchersTemplatePath, locals, true)
        expect(email.response).toBeTruthy()
    })
})