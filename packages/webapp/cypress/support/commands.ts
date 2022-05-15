// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { AuthTokens } from '@wille430/common'

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
        login(): Chainable<AuthTokens>
        authenticate(jwt: string): void
    }
}
//
// -- This is a parent command --

Cypress.Commands.add('login', () => {
    cy.request('post', 'http://localhost:3001/test/user').then((res) => {
        const { email, password }: AuthTokens & { email: string; password: string } = res.body

        console.log({ email, password })

        cy.request(
            'post',
            Cypress.config('baseUrl') + '/api/login',
            JSON.stringify({ email, password })
        ).then((res) => {
            const { access_token, refresh_token } = res.body
            return cy.wrap({ access_token, refresh_token, email, password })
        })
    })
})

Cypress.Commands.add('authenticate', ({ email, password }: { email: string; password: string }) => {
    cy.request(
        'post',
        Cypress.config('baseUrl') + '/api/login',
        JSON.stringify({ email, password })
    )
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
