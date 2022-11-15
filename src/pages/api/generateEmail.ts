import { ListingOrigin } from '@/common/schemas'
import { createFakeListing } from '@/common/test/factories/createFakeListing'
import { EmailService } from '@/lib/modules/email/email.service'
import { EmailTemplate } from '@/lib/modules/email/enums/email-template.enum'
import { faker } from '@faker-js/faker'
import { NextApiRequest } from 'next'
import { NotFoundException } from 'next-api-decorators'
import 'reflect-metadata'
import { container } from 'tsyringe'

export default async function generateEmail(req: NextApiRequest, res) {
    const emailService = container.resolve(EmailService)
    const emailTemplate = req.query.template as EmailTemplate
    const template = emailService.getTemplate(emailTemplate)

    const getArgs = (): any => {
        switch (emailTemplate) {
            case EmailTemplate.FORGOTTEN_PASSWORD:
            case EmailTemplate.VERIFY_EMAIL:
                return {
                    link: faker.internet.url(),
                }
            case EmailTemplate.NEW_ITEMS:
                const listings = Array(faker.datatype.number({ min: 3, max: 12 }))
                    .fill(null)
                    .map(() => createFakeListing())
                return {
                    listings,
                    listingCount: listings.length,
                    filters: {
                        keyword: faker.random.words(),
                        categories: faker.helpers.arrayElements(Object.values(ListingOrigin)),
                    },
                }
        }
    }

    if (!template) {
        throw new NotFoundException(emailTemplate + ' is not a template')
    }

    const { html, errors } = template(getArgs())
    if (errors.length) {
        return res.status(500).json({
            errors,
        })
    }
    return res.send(html)
}
