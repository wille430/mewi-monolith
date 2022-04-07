import { Utils } from '@wille430/common'

describe('forgotten password', () => {
    beforeEach(() => {
        cy.visit('/glomtlosenord')
    })

    it('should submit correctly with valid email', () => {
        const email = Utils.randomEmail()

        cy.getBySel('emailInput').type(email)
        cy.getBySel('formSubmitButton').click()

        cy.contains(email)
    })
})
