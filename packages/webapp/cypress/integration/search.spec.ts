import { Types, Utils } from '@wille430/common'
import _ from 'lodash'
import queryString from 'query-string'
import { setFilters } from '../../../webapp/src/store/search/creators'

interface FormData extends Types.ListingSearchFilters {
    regions?: string
}

describe('search', () => {
    let formData: FormData = {}
    const debounceWait = 1500

    beforeEach(() => {
        cy.visit('/search')

        formData = {
            // category: _.sample(Object.keys(categories)),
            regions: _.sampleSize(Types.regions).map((regionOption) => regionOption.label)[0],
            priceRangeGte: Math.round(Math.random() * 2000),
            priceRangeLte: Math.round((1 + Math.random()) * 2000),
            auction: Math.round(Math.random()) === 1 ? true : false,
        }

        console.log('Filtering search with:', JSON.stringify(formData))
    })

    Cypress._.times(1, () => {
        it('can filter with randomized filters and search', () => {
            // TODO: select category from category selection list

            // open filters
            cy.getBySel('showFilters').click()

            // Insert regions
            // FIXME: fix detached from DOM error
            // TODO: insert multiple regions
            cy.getBySel('regionsSelect', { timeout: 1000 }).type(formData.regions + ' {enter}', {
                delay: 150,
            })

            cy.getBySel('regionsSelect').should('have.text', formData.regions)

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
                            if (typeof parsedUrl.regions === 'string') {
                                expect(formData.regions?.toLowerCase()).to.equal(parsedUrl[key])
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

    it('can search for a new keyword', () => {
        const keyword = Utils.randomString(5)

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
        cy.window().its('store').invoke('dispatch', setFilters(formData))

        // wait for debounce
        cy.wait(debounceWait)

        cy.getBySel('addWatcherButton').click()

        // accept modal
        cy.getBySel('modalAccept').click()

        cy.contains('Bevakningen lades till', { matchCase: false })
    })

    // TODO: filters should be cleared
    // it('keeps filters when changing categories', () => {
    //     cy.window().its('store').invoke('dispatch', setFilters(formData))

    //     // change category
    //     const newCategoryKey = _.sample(Object.keys(Types.Category)) as keyof typeof Types.Category
    //     cy.getBySel(`categoryListItem-0`).contains(Types.CategoryLabel[newCategoryKey as keyof typeof Types.Category]).click()

    //     // expect url search params to update correctly
    //     cy.location().then((loc) => {
    //         const searchParams = queryString.parse(loc.search)

    //         console.log(decodeURI(loc.pathname), `/kategorier/${Types.Category[newCategoryKey as keyof typeof Types.Category]}`)

    //         expect(!!decodeURI(loc.pathname).match(`/kategorier/${Types.Category[newCategoryKey as keyof typeof Types.Category]}`)).to.equal(true)

    //         const keysToIgnore = ['category']

    //         if (!formData.auction) keysToIgnore.push('auction')

    //         expect(Object.keys(searchParams)).to.have.members(
    //             Object.keys(formData).filter((x) => !keysToIgnore.includes(x))
    //         )

    //         for (const key in searchParams) {
    //             switch (key) {
    //                 case 'priceRangeGte':
    //                 case 'priceRangeLte':
    //                     expect(parseInt(searchParams[key] as string)).to.equal(formData[key])
    //                     break
    //                 case 'auction':
    //                     expect(Boolean(searchParams[key])).to.equal(formData[key])
    //                     break
    //                 default:
    //                     expect(searchParams[key]).to.equal(formData[key as keyof FormData])
    //             }
    //         }
    //     })
    // })

    it('should be able to navigate through pages', () => {
        cy.visit('/')
        cy.getBySel('searchInput').type('{enter}')

        cy.wrap(Array(1)).each((ele, i) => {
            const currentPage = i + 2
            cy.getBySel('pageNav').contains(currentPage).click()

            cy.location().then((loc) => {
                const searchParams = queryString.parse(loc.search)
                expect(searchParams['page']).to.equal(currentPage.toString())
            })
        })

        cy.location().then((loc) => {
            const currentPage = parseInt(queryString.parse(loc.search)['page'] as string)

            cy.getBySel('pageNavNext').click()

            cy.wrap(currentPage).then((page) => {
                cy.location().then((loc) => {
                    const searchParams = queryString.parse(loc.search)
                    expect(searchParams['page']).to.equal((page + 1).toString())
                })

                cy.getBySel('pageNavPrev').click()

                cy.location().then((loc) => {
                    const searchParams = queryString.parse(loc.search)
                    expect(searchParams['page']).to.equal(page.toString())
                })
            })
        })
    })
})
