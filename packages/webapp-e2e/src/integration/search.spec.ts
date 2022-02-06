import { regions, SearchFilterDataProps } from '@mewi/types'
import { randomString } from '@mewi/util'
import _ from 'lodash'
import queryString from 'query-string'

interface FormData extends SearchFilterDataProps {
    regions?: string[]
}

describe('search', () => {
    let formData: FormData = {}
    const longWait = 3000
    const debounceWait = 1000

    beforeEach(() => {
        cy.visit('/search')

        formData = {
            // category: _.sample(Object.keys(categories)),
            regions: _.sampleSize(regions).map((regionOption) => regionOption.label),
            priceRangeGte: Math.round(Math.random() * 2000),
            priceRangeLte: Math.round((1 + Math.random()) * 2000),
            auction: Math.round(Math.random()) === 1 ? true : false,
        }

        console.log('Filtering search with:', JSON.stringify(formData))
    })

    Cypress._.times(3, () => {
        it('can filter with randomized filters and search', () => {
            // TODO: select category from category selection list

            cy.wait(longWait)

            // Insert regions
            // FIXME: fix detached from DOM error
            // TODO: insert multiple regions
            cy.get('[data-testid=regionsSelect]').type(formData.regions[0] + ' {enter}', {
                delay: 100,
            })

            cy.get('[data-testid=regionsSelect]').should('have.text', formData.regions[0])

            // Insert price range
            cy.get('[data-testid=priceGte]').type(formData.priceRangeGte + '{enter}')
            cy.get('[data-testid=priceGte]').should('have.value', formData.priceRangeGte)

            cy.get('[data-testid=priceLte]').type(formData.priceRangeLte + '{enter}')
            cy.get('[data-testid=priceLte]').should('have.value', formData.priceRangeLte)

            if (formData.auction) {
                cy.get('[data-testid=auctionCheckbox]').click()
                cy.get('[data-testid=auctionCheckbox]').should('be.checked')
            } else {
                cy.get('[data-testid=auctionCheckbox]').should('not.be.checked')
            }

            // wait for debounce
            cy.wait(debounceWait)

            // validate url
            cy.location().then((loc) => {
                const parsedUrl: typeof formData = queryString.parse(loc.search)
                console.log('PARSED URL:', parsedUrl)

                _.forOwn(formData, (value, key: keyof typeof formData) => {
                    if (!value) {
                        expect(parsedUrl[key]).to.be.an('undefined')
                        return
                    }

                    switch (key) {
                        case 'regions':
                            if (typeof parsedUrl.regions === 'string') {
                                expect(formData.regions).to.have.lengthOf(1)
                                expect(formData.regions[0].toLowerCase()).to.equal(parsedUrl[key])
                            } else {
                                // TODO: validate if parsed url contains an array of regions
                            }
                            break
                        case 'priceRangeGte':
                            expect(parsedUrl.priceRangeGte).to.equal(
                                formData.priceRangeGte.toString()
                            )
                            break
                        case 'priceRangeLte':
                            expect(parsedUrl.priceRangeGte).to.equal(
                                formData.priceRangeGte.toString()
                            )
                            break
                        default:
                            expect(parsedUrl[key]).to.equal(value.toString())
                    }
                })
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

        cy.wait(longWait)

        // Inserts category
        // cy.get('[data-testid=categorySelect]').type(formData.category + '{enter}')

        // Inserts regions
        formData.regions.forEach((region) => {
            cy.get('[data-testid=regionsSelect]').type(region + ' {enter}', { delay: 100 })
        })

        // Inserts price range
        cy.get('[data-testid=priceGte]').type(formData.priceRangeGte + '{enter}')
        cy.get('[data-testid=priceLte]').type(formData.priceRangeLte + '{enter}')

        if (formData.auction) {
            cy.get('[data-testid=auctionCheckbox]').click()
        }

        // wait for debounce
        cy.wait(debounceWait)

        cy.get('[data-testid=addWatcherButton]').click()
        cy.contains('Bevakningen lades till', { matchCase: false })
    })
})
