import { randomEmail } from '@mewi/util'

describe('forgotten password', () => {
    beforeEach(() => {
        cy.visit('/glomtlosenord')
    })

    it('should submit correctly with valid email', () => {
        const email = randomEmail()

        cy.getBySel('emailInput').type(email)
        cy.getBySel('formSubmitButton').click()

        cy.contains(email)
    })
})