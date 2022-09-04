import { ListingSearchFilters, regions } from '@wille430/common'
import sampleSize from 'lodash/sampleSize'
import queryString from 'query-string'
import faker from '@faker-js/faker'

describe('search', () => {
    describe('from /sok', () => {
        let formData: ListingSearchFilters = {}
        const debounceWait = 1500

        beforeEach(() => {
            cy.visit('/sok')

            formData = {
                // TODO: test category sorting
                region: sampleSize(regions)
                    .map((regionOption) => regionOption.label)
                    .join(', '),
                priceRangeGte: Math.round(Math.random() * 2000),
                priceRangeLte: Math.round((1 + Math.random()) * 2000),
                auction: Math.round(Math.random()) === 1 ? true : false,
            }

            console.log('Filtering search with:', JSON.stringify(formData))
        })

        Cypress._.times(1, () => {
            it('can filter with randomized filters and search', () => {
                // TODO: select category from category selection list
                // TODO: insert multiple regions
                for (const region of formData.region ?? []) {
                    cy.getBySel('regionsSelect').type(region + ' {enter}')

                    cy.getBySel('regionsSelect').contains(region)
                }

                // Insert price range
                if (formData.priceRangeGte) {
                    cy.getBySel('priceGte').type(formData.priceRangeGte.toString())
                    cy.getBySel('priceGte').should('have.value', formData.priceRangeGte)
                }

                if (formData.priceRangeLte) {
                    cy.getBySel('priceLte').type(formData.priceRangeLte.toString())
                    cy.getBySel('priceLte').should('have.value', formData.priceRangeLte)
                }

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

                    for (const key of Object.keys(formData)) {
                        const value = formData[key as keyof FormData]

                        if (!value) {
                            expect(parsedUrl[key as keyof FormData]).to.be.an('undefined')
                            return
                        }

                        switch (key) {
                            case 'regions':
                                if (formData.region && typeof parsedUrl.region === 'string') {
                                    expect(formData.region[0].toLowerCase()).to.equal(
                                        parsedUrl[key]
                                    )
                                } else {
                                    // TODO: validate if parsed url contains an array of regions
                                }
                                break
                            case 'priceRangeGte':
                                expect(parsedUrl.priceRangeGte).to.equal(
                                    formData.priceRangeGte?.toString()
                                )
                                break
                            case 'priceRangeLte':
                                expect(parsedUrl.priceRangeGte).to.equal(
                                    formData.priceRangeGte?.toString()
                                )
                                break
                            default:
                                expect(parsedUrl[key as keyof FormData]).to.equal(value.toString())
                        }
                    }
                })
            })
        })

        it('redirects to login page if adding watcher without being logged in', () => {
            // cy.getBySel('showFilters').click()

            cy.contains('BEVAKA SÖKNING').click()
            cy.url().should('contain', '/loggain')
        })

        it('can add a watcher from current search', () => {
            cy.login()

            // cy.getBySel('showFilters').click()

            // Set filters
            cy.visit('/sok?' + queryString.stringify(formData))

            // wait for debounce
            cy.wait(debounceWait)
            cy.wait(debounceWait)

            cy.getBySel('addWatcherButton').click()

            // accept modal
            cy.getBySel('modalAccept').click()

            // TODO: check success message
            // cy.contains('Bevakningen lades till', { matchCase: false })
        })
    })

    // TODO: filters should be cleared

    describe('from /', () => {
        beforeEach(() => {
            cy.visit('/')
        })

        it('should redirect to /sok with correct filters', () => {
            const keyword = faker.random.words(3)

            cy.getBySel('search-input').get('input').type(keyword).type('{enter}')

            cy.location('pathname').should('equal', '/sok')
            cy.location('search').should('contain', `keyword=${keyword.replaceAll(' ', '+')}`)
            cy.get('input:visible').first().should('have.value', keyword)
        })
    })
})
