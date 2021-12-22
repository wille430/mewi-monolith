import _ from 'lodash'
describe('login', () => {
    let authTokens
    let userInfo

    before(() => {
        cy.request('post', 'http://localhost:3001/test/user').then((res) => {
            authTokens = _.pick(res.body, ['jwt', 'refreshToken'])
            userInfo = _.pick(res.body, ['email', 'password'])
        })
    })

    beforeEach(() => {
        cy.clearLocalStorage()
        cy.visit('/login')
    })

    it('should login user with correct credentials', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=formSubmitButton]').click()

        cy.url().should('equal', Cypress.config('baseUrl') + 'minabevakningar')
        cy.clearLocalStorage('jwt')
        cy.clearLocalStorage('refreshToken')
    })

    it('should display invalid password message', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email)
        cy.get('[data-testid=passwordInput]').type(userInfo.password + '123')
        cy.get('[data-testid=formSubmitButton]').click()

        cy.get('span:contains(Felaktig epostaddress eller lösenord)').should('have.length', 2)
    })

    it('should display invalid email message', () => {
        cy.get('[data-testid=emailInput]').type(userInfo.email + 'b')
        cy.get('[data-testid=passwordInput]').type(userInfo.password)
        cy.get('[data-testid=formSubmitButton]').click()

        cy.get('span:contains(Felaktig epostaddress eller lösenord)').should('have.length', 2)
    })
})
