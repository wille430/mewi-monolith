// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
        login(): Chainable<string>
        authenticate(jwt: string): void
    }
}
//
// -- This is a parent command --

Cypress.Commands.add('login', () => {
    cy.request('post', 'http://localhost:3001/test/user').then((res) => {
        const { jwt, refreshToken } = res.body

        window.localStorage.setItem('jwt', jwt)
        window.localStorage.setItem('refreshToken', refreshToken)

        return cy.wrap(jwt)
    })
})

Cypress.Commands.add('authenticate', (jwt: string) => {
    window.localStorage.setItem('jwt', jwt)
})

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getBySel', (selector, ...args) => {
    return cy.get(`[data-testid=${selector}]:visible`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
    return cy.get(`[data-test*=${selector}]`, ...args)
})
