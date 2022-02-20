import { regions, SearchFilterDataProps } from '@mewi/types'
import { randomString } from '@mewi/util'
import _ from 'lodash'
import queryString from 'query-string'

interface FormData extends SearchFilterDataProps {
    regions?: string[]
}

describe('search', () => {
    let formData: FormData = {}
    const longWait = 3500
    const debounceWait = 1500

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

    Cypress._.times(1, () => {
        it('can filter with randomized filters and search', () => {
            // TODO: select category from category selection list

            cy.wait(longWait)

            // open filters
            cy.getBySel('showFilters').click()

            // Insert regions
            // FIXME: fix detached from DOM error
            // TODO: insert multiple regions
            cy.getBySel('regionsSelect', { timeout: 1000 }).type(formData.regions[0] + ' {enter}', {
                delay: 150,
            })

            cy.getBySel('regionsSelect').should('have.text', formData.regions[0])

            // Insert price range
            cy.getBySel('priceGte').type(formData.priceRangeGte.toString())
            cy.getBySel('priceGte').should('have.value', formData.priceRangeGte)

            cy.getBySel('priceLte').type(formData.priceRangeLte.toString())
            cy.getBySel('priceLte').should('have.value', formData.priceRangeLte)

            if (formData.auction) {
                cy.getBySel('auctionCheckbox').click()
                cy.getBySel('auctionCheckbox').should('be.checked')
            } else {
                cy.getBySel('auctionCheckbox').should('not.be.checked')
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

        cy.getBySel('searchInput').type(keyword + '{enter}')

        cy.url().should('contain', '/search?keyword=' + keyword)

        cy.contains(/^(Hittade )([0-9]*)( resultat)/gi)
    })

    it('redirects to login page if adding watcher without being logged in', () => {
        cy.getBySel('showFilters').click()

        cy.contains('Bevaka sökning').click()
        cy.url().should('contain', '/login')
    })

    it('can add a watcher from current search', () => {
        cy.login()

        cy.getBySel('showFilters').click()

        cy.wait(longWait)

        // Inserts category
        // cy.get('[data-testid=categorySelect]').type(formData.category + '{enter}')

        // Inserts regions
        formData.regions.forEach((region) => {
            cy.getBySel('regionsSelect', { timeout: 1000 }).type(region + ' {enter}', {
                delay: 100,
            })
        })

        // Inserts price range
        cy.getBySel('priceGte').type(formData.priceRangeGte.toString())
        cy.getBySel('priceLte').type(formData.priceRangeLte.toString())

        if (formData.auction) {
            cy.getBySel('auctionCheckbox').click()
        }

        // wait for debounce
        cy.wait(debounceWait)

        cy.getBySel('addWatcherButton').click()

        // accept modal
        cy.getBySel('modalAccept').click()

        cy.contains('Bevakningen lades till', { matchCase: false })
    })
})
