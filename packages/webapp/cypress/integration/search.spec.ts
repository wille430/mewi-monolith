import { ListingSearchFilters, regions } from '@wille430/common'
import sampleSize from 'lodash/sampleSize'
import queryString from 'query-string'
import faker from '@faker-js/faker'
import _ from 'lodash'
import { Category } from '@wille430/common'

describe('search', () => {
    describe('from /sok', () => {
        let formData: ListingSearchFilters = {}
        const debounceWait = 1500

        beforeEach(() => {
            cy.visit('/sok')

            const sampleCategories = sampleSize(
                Object.keys(Category),
                Math.floor(Math.random() * 4)
            ) as Category[]

            const sampleRegions = sampleSize(regions)
                .map((regionOption) => regionOption.label)
                .join(', ')

            formData = {
                region: sampleRegions,
                categories: sampleCategories,
                priceRangeGte: Math.round(Math.random() * 2000),
                priceRangeLte: Math.round((1 + Math.random()) * 2000),
                auction: Math.round(Math.random()) === 1 ? true : false,
            }
        })

        Cypress._.times(1, () => {
            it('can filter with randomized filters and search', () => {
                for (const category of formData.categories ?? []) {
                    cy.getBySel(`category-${category}`).check()
                    cy.getBySel(`category-${category}`).should('be.checked')
                }

                if (formData.region) {
                    cy.getBySel('regionInput').type(formData.region + '{enter}')
                    cy.getBySel('regionInput').should('have.value', formData.region)
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

                    for (const key of Object.keys(formData)) {
                        const value = formData[key as keyof FormData]

                        if (!value) {
                            expect(parsedUrl[key as keyof FormData]).to.be.an('undefined')
                            return
                        }

                        switch (key) {
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
                            case 'auction':
                                if (formData.auction === true) {
                                    expect(parsedUrl[key]).to.equal('true')
                                } else {
                                    expect(parsedUrl[key]).to.be.an('undefined')
                                }
                                break
                            case 'categories':
                                if (formData.categories?.length === 1) {
                                    expect(parsedUrl.categories).to.be(value[0])
                                } else if (formData.categories?.length ?? 0 > 0) {
                                    expect(parsedUrl.categories).to.eql(value)
                                } else {
                                    expect(parsedUrl.categories).to.be.an('undefined')
                                }
                                break
                            default:
                                expect(parsedUrl[key as keyof FormData]).to.equal(value.toString())
                        }
                    }
                })
            })
        })

        it('redirects to login page if adding watcher without being logged in', () => {
            cy.contains('BEVAKA SÖKNING').click()
            cy.url().should('contain', '/loggain')
        })

        it('can add a watcher from current search', () => {
            cy.login()

            cy.visit('/sok?' + queryString.stringify(formData))

            // wait for debounce
            cy.wait(debounceWait)

            cy.getBySel('addWatcherButton').click()

            // accept modal
            cy.getBySel('modalAccept').click()

            cy.contains('Bevakningen lades till', { matchCase: false })
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
