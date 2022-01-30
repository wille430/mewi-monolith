import { regions, SearchFilterDataProps } from '@mewi/types'
import { randomString } from '@mewi/util'
import _ from 'lodash'
import queryString from 'query-string'

interface FormData extends SearchFilterDataProps {
    regions?: string[]
}

describe('search', () => {
    let formData: FormData = {}

    beforeEach(() => {
        cy.visit('/search')

        formData = {
            // category: _.sample(Object.keys(categories)),
            regions: _.sampleSize(regions, Math.random() * 3).map(
                (regionOption) => regionOption.label
            ),
            priceRange: {
                gte: Math.round(Math.random() * 2000),
                lte: Math.round((1 + Math.random()) * 2000),
            },
            auction: Math.round(Math.random()) === 1 ? true : false,
        }
    })

    Cypress._.times(3, () => {
        it('can filter with randomized filters and search', () => {
            // TODO: select category from category selection list

            // Inserts regions
            formData.regions.forEach((region) => {
                // FIXME: fix detached from DOM error
                cy.get('[data-testid=regionsSelect]').type(region + ' {enter}', { delay: 100 })
            })

            // Inserts price range
            _.forOwn(formData.priceRange, (value, key) => {
                switch (key) {
                    case 'gte':
                        cy.get('[data-testid=priceGte]').type(value.toString() + '{enter}')
                        break
                    case 'lte':
                        cy.get('[data-testid=priceLte]').type(value.toString() + '{enter}')
                        break
                }
            })

            if (formData.auction) {
                cy.get('[data-testid=auctionCheckbox]').click()
            }

            // The input values should be displayed
            _.forOwn(formData, (value, key) => {
                switch (key) {
                    case 'category':
                        // TODO: Expect category in selection list to be bold
                        // cy.get('[data-testid=categorySelect]').contains(
                        //     categories[formData[key]].label,
                        //     {
                        //         matchCase: false,
                        //     }
                        // )
                        break
                    case 'regions':
                        formData[key].forEach((region) => {
                            cy.get('[data-testid=regionsSelect]').contains(region)
                        })
                        break
                    case 'price':
                        cy.get('[data-testid=priceGte]').contains(formData[key].gte)
                        cy.get('[data-testid=priceLte]').contains(formData[key].lte)
                        break
                    case 'auction':
                        if (formData.auction) {
                            cy.get('[data-testid=auctionCheckbox]').should('be.checked')
                        } else {
                            cy.get('[data-testid=auctionCheckbox]').should('not.be.checked')
                        }
                        break
                }
            })

            _.forOwn(formData, (value, field) => {
                if (!formData.auction) return

                cy.url({ decode: true }).should(
                    'contain',
                    queryString.stringify({ [field]: value }, { encode: false }).toLowerCase()
                )
            })
        })
    })

    it('can search for a new keyword', () => {
        const keyword = randomString(5)

        cy.get('[data-testid=searchInput]').type(keyword + '{enter}')

        cy.url().should('contain', '/search?keyword=' + keyword)

        cy.contains(/^(Hittade )([0-9]*)( resultat)/gi)
    })

    it('redirects to login page if adding watcher without being logged in', () => {
        cy.contains('Bevaka sökning').click()
        cy.url().should('contain', '/login')
    })

    it('can add a watcher from current search', () => {
        cy.request('post', 'http://localhost:3001/test/user').then((res) => {
            window.localStorage.setItem('jwt', res.body.jwt)
            window.localStorage.setItem('refreshToken', res.body.refreshToken)
        })

        // Inserts category
        // cy.get('[data-testid=categorySelect]').type(formData.category + '{enter}')

        // Inserts regions
        formData.regions.forEach((region) => {
            cy.get('[data-testid=regionsSelect]').type(region + ' {enter}', { delay: 100 })
        })

        // Inserts price range
        _.forOwn(formData.priceRange, (value, key) => {
            switch (key) {
                case 'gte':
                    cy.get('[data-testid=priceGte]').type(value.toString() + '{enter}')
                    break
                case 'lte':
                    cy.get('[data-testid=priceLte]').type(value.toString() + '{enter}')
                    break
            }
        })

        if (formData.auction) {
            cy.get('[data-testid=auctionCheckbox]').click()
        }

        cy.get('[data-testid=addWatcherButton]').click()
        cy.contains('Bevakningen lades till', { matchCase: false })
    })
})
