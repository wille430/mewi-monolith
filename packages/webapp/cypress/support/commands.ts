Cypress.Commands.add('login', () =>
    cy.request('get', Cypress.env('api_server') + '/test/user').then((res) => res.body)
)

Cypress.Commands.add('getBySel', (selector, ...args) => {
    return cy.get(`[data-testid=${selector}]:visible`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
    return cy.get(`[data-test*=${selector}]`, ...args)
})

export {}
