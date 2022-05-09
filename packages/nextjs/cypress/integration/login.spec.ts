import _ from 'lodash'
describe('login', () => {
    let userInfo: { email: string; password: string }

    before(() => {
        cy.request('post', 'http://localhost:3001/test/user').then((res) => {
            userInfo = _.pick(res.body, ['email', 'password'])
        })
    })

    beforeEach(() => {
        cy.clearLocalStorage()
        cy.visit('/login/email')
    })

    it('should login user with correct credentials', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=formSubmitButton]').click()

        cy.url().should('equal', Cypress.config('baseUrl') + '/minabevakningar')
    })

    it('should display invalid generic error', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password + '123')
        cy.get('[data-testid=formSubmitButton]').click()

        cy.contains('Felaktig e-postadress eller lösenord')
    })
})