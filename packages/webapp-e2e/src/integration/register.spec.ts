import { randomString } from '@mewi/util'
describe('register', () => {
    const userInfo = {
        email: randomString(12) + '@removeme.com',
        password: `./${randomString(20)}123`,
    }

    beforeEach(() => {
        cy.visit('/register')
        userInfo.email = randomString(12) + '@removeme.com'
        userInfo.password = `./${randomString(20)}123`
    })

    it('should register a new user', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=repasswordInput]').type(userInfo.password)

        cy.get('[data-testid=formSubmitButton]').click()

        cy.url().should('equal', Cypress.config('baseUrl') + 'minabevakningar')
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

        cy.contains('felaktig epostaddress', { matchCase: false })
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
            repassword: userInfo.password,
        })

        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=repasswordInput]').type(userInfo.password)

        cy.get('[data-testid=formSubmitButton]').click()

        cy.contains('epostaddressen är upptagen', { matchCase: false })
    })
})
