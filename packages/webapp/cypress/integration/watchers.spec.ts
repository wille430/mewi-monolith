import { capitalize } from '@wille430/common'

describe('watchers', () => {
    const longWait = 1000
    let email: string
    let password: string

    const formData = {
        keyword: 'volvo',
        regions: ['göteborg'],
        category: 'fordon',
        price: {
            gte: '100',
            lte: '1000',
        },
        isAuction: true,
    }

    before(() => {
        cy.login().then((data) => {
            email = data.email
            password = data.password
        })
    })

    beforeEach(() => {
        cy.authenticate({ email, password })
        cy.visit('/minasidor/bevakningar')
    })

    it('can create a new watcher and display it', () => {
        cy.get('[data-testid=createNewWatcherButton]').click()

        // Fill in fields start
        cy.get('[data-testid=keywordInput]').type(formData.keyword)
        cy.get('[data-testid=keywordInput]').should('have.value', formData.keyword)

        // wait for region select to load fully
        cy.wait(longWait)
        cy.get('[data-testid=regionsSelect]').type(capitalize(formData.regions[0]) + ' {enter}', {
            delay: 100,
        })
        cy.get('[data-testid=regionsSelect]').contains(capitalize(formData.regions[0]))

        cy.get('[data-testid=categorySelect]').type(formData.category + '{enter}')
        cy.get('[data-testid=categorySelect]').contains(capitalize(formData.category))

        cy.get('[data-testid=priceGte]').type(formData.price.gte)
        cy.get('[data-testid=priceGte]').should('have.value', formData.price.gte)

        cy.get('[data-testid=priceLte]').type(formData.price.lte)
        cy.get('[data-testid=priceLte]').should('have.value', formData.price.lte)
        // Fiell in fields end

        if (formData.isAuction) cy.get('[data-testid=auctionCheckbox]').click()

        // submit
        cy.get('[data-testid=addWatcherButton]').click()

        // accept in modal
        cy.get('[data-testid=modalAccept]').click()

        cy.get('[data-testid=addWatcherPopUp]').should('not.be.visible')

        // Validate displayed created watcher
        Object.keys(formData).forEach((key) => {
            switch (key) {
                case 'regions':
                    formData[key].forEach((region) => {
                        cy.get('[data-testid=watcherCard]')
                            .children()
                            .contains(region, { matchCase: false })
                    })
                    break
                case 'price':
                    cy.get('[data-testid=watcherCard]').children().contains(formData[key].gte)
                    cy.get('[data-testid=watcherCard]').children().contains(formData[key].lte)
                    break
                case 'isAuction':
                    if (formData.isAuction) {
                        cy.get('[data-testid=watcherCard]').children().contains('label', 'Auktion')
                    } else {
                        cy.get('[data-testid=watcherCard]')
                            .children()
                            .should('not.contain', 'Auktion')
                    }
                    break
                default:
                    cy.get('[data-testid=watcherCard]')
                        .children()
                        .contains(formData[key as keyof typeof formData].toString(), {
                            matchCase: false,
                        })
            }
        })
    })

    it('can redirect to search page', () => {
        cy.get('[data-testid=watcherCard]')
            .first()
            .children()
            .get('[data-testid=watcherSearchButton]')
            .click()

        cy.wait(2000)

        if (formData.category) {
            cy.url().should('contain', '/kategorier')
        } else {
            cy.url().should('contain', '/search')
        }

        // TODO: CHECK FILTERS IN FILTER AREA + URL
    })

    it('can delete watchers', () => {
        cy.get('[data-testid=removeWatcherButton]').each((el) => {
            cy.wrap(el).click()
        })

        cy.get('[data-testid=watcherCard]').should('not.exist')

        // Expect notification to be displayed
        // cy.get('[data-testid=snackbarContainer]').should('exist')
    })
})
