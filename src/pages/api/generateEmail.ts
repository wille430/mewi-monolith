import { verifyEmailTemplate } from '@/lib/modules/email/templates/verifyEmailTemplate'
import { faker } from '@faker-js/faker'

export default async function generateEmail(req, res) {
    const { html, errors } = verifyEmailTemplate({
        link: faker.internet.url(),
    })
    if (errors.length) {
        return res.status(500).json({
            errors,
        })
    }
    return res.send(html)
}
