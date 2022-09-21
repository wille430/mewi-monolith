import { randomString } from '@wille430/common'
import { randomEmail, randomPassword } from '@mewi/test-utils'

describe('register', () => {
    const userInfo = {
        email: randomEmail(),
        password: randomPassword(),
    }

    beforeEach(() => {
        cy.visit('/nyttkonto')
        userInfo.email = randomEmail()
        userInfo.password = randomPassword()
    })

    it('should register a new user', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=repasswordInput]').type(userInfo.password)

        cy.get('[data-testid=formSubmitButton]').click()

        cy.url().should('equal', Cypress.config('baseUrl') + '/minasidor/bevakningar')

        // wait for side nav to load
        cy.getBySel('side-nav')

        cy.reload()

        // wait for side nav to load
        cy.getBySel('side-nav')
        cy.location('pathname').should('equal', '/minasidor/bevakningar')
        cy.location('pathname').should('not.equal', '/loggain')
    })

    it('should display too weak password message', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type('mittlösen123')
        cy.get('[data-testid=repasswordInput]').type('mittlösen123')

        cy.get('[data-testid=formSubmitButton]').click()

        cy.contains('lösenordet är för svagt', { matchCase: false })
    })

    it('should display invalid email message', () => {
        cy.get('[data-testid=emailInput]').type(randomString(10))
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=repasswordInput]').type(userInfo.password)

        cy.get('[data-testid=formSubmitButton]').click()

        cy.contains('e-postadressen är felaktig', { matchCase: false })
    })

    it('should display passwords must match', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=repasswordInput]').type(userInfo.password + '123')

        cy.get('[data-testid=formSubmitButton]').click()

        cy.contains('lösenorden måste matcha', { matchCase: false })
    })

    it('should display error when email is in use already', () => {
        cy.request('post', 'http://localhost:3001/auth/signup', {
            ...userInfo,
            passwordConfirm: userInfo.password,
        })

        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=repasswordInput]').type(userInfo.password)

        cy.get('[data-testid=formSubmitButton]').click()

        cy.contains('e-postadressen är upptagen', { matchCase: false })
    })
})
