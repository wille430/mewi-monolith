import EmailService from './EmailService'

describe('Email Service', () => {
    it('should be able to send notification of new items',  async () => {
        const locals = {
            newItemCount: 100,
            keyword: 'test',
            items: [],
        }

        console.log('template path:', EmailService.newWatchersTemplatePath)

        const email = await EmailService.sendEmail('wille430@gmail.com', EmailService.newWatchersTemplatePath, locals)
        expect(email.response).toBeTruthy()
    })
})