describe('navigation', () => {
    it('can navigate through nav bar', () => {
        cy.visit('/')

        cy.get('[data-testid=nav] ul > li').each((ele, i) => {
            if (i === 0 || i === 1) return

            cy.get('[data-testid=nav] ul > li > a').eq(i).click()
            cy.location('pathname').should('not.equal', '/')
            cy.visit('/')
        })
    })
})
