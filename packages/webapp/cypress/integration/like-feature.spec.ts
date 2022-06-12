const LIKE_BUTTON = 'like-button'

describe('like feature', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    describe('when logged out', () => {
        it('should redirect to login', () => {
            cy.getBySel('listing-0')
                .realHover()
                .within(() => {
                    cy.getBySel(LIKE_BUTTON)
                })
        })
    })

    describe('when logged in', () => {
        beforeEach(() => {
            cy.login()
        })

        describe('from featured listings', () => {
            it('should like and unlike', () => {
                cy.getBySel('listing-0')
                    .invoke('attr', 'data-id')
                    .then((id) => {
                        // hover
                        cy.getBySel('listing-0').trigger('mouseover')

                        cy.getBySel(LIKE_BUTTON)
                            .first()
                            .should('have.attr', 'data-liked')
                            .and('equal', 'false')
                        cy.getBySel(LIKE_BUTTON).first().click()
                        cy.getBySel(LIKE_BUTTON)
                            .first()
                            .should('have.attr', 'data-liked')
                            .and('equal', 'true')

                        // Reload and check for consistency
                        cy.reload()
                        cy.getBySel(LIKE_BUTTON)
                            .first()
                            .should('have.attr', 'data-liked')
                            .and('equal', 'true')

                        cy.visit('/minasidor/gillade')

                        cy.get(`[data-id=${id}]`).should('be.visible')
                    })

                cy.getBySel('listing-0').trigger('mouseover')
                cy.getBySel('listing-0').realHover()
                cy.getBySel(LIKE_BUTTON).first().click()
                cy.getBySel(LIKE_BUTTON).should('have.attr', 'data-liked').and('equal', 'false')

                cy.reload()

                cy.getBySel('listing-0').should('not.exist')
            })
        })

        describe('from search', () => {
            beforeEach(() => {
                cy.visit('/sok')
            })

            it('should like and unlike', () => {
                // hover
                cy.getBySel('listing-0').trigger('mouseover')

                // like
                cy.getBySel(LIKE_BUTTON)
                    .first()
                    .should('have.attr', 'data-liked')
                    .and('equal', 'false')
                cy.getBySel(LIKE_BUTTON).first().click()
                cy.getBySel(LIKE_BUTTON)
                    .first()
                    .should('have.attr', 'data-liked')
                    .and('equal', 'true')

                // Reload and check for consistency
                cy.reload()
                cy.getBySel(LIKE_BUTTON)
                    .first()
                    .should('have.attr', 'data-liked')
                    .and('equal', 'true')

                cy.visit('/minasidor/gillade')

                // Unlike
                cy.getBySel('listing-0').trigger('mouseover')
                cy.getBySel('listing-0').realHover()
                cy.getBySel(LIKE_BUTTON).first().click()
                cy.getBySel(LIKE_BUTTON).should('have.attr', 'data-liked').and('equal', 'false')

                cy.reload()

                cy.getBySel('listing-0').should('not.exist')
            })
        })
    })
})
