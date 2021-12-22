describe('watchers', () => {
    let accessTokens

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
        cy.request('post', 'http://localhost:3001/test/user').then((res) => {
            accessTokens = res.body

            window.localStorage.setItem('jwt', accessTokens.jwt)
            window.localStorage.setItem('refreshToken', accessTokens?.refreshToken)

            cy.visit('/minabevakningar')
        })
    })

    it('it can create a new watcher and display it', () => {
        cy.get('[data-testid=createNewWatcherButton]').click()

        cy.get('[data-testid=keywordInput]').type(formData.keyword)
        cy.get('[data-testid=regionsSelect]').type(formData.regions[0] + '{enter}')

        cy.get('[data-testid=categorySelect]').type(formData.category + '{enter}')

        cy.get('[data-testid=priceGte]').type(formData.price.gte)
        cy.get('[data-testid=priceLte]').type(formData.price.lte)

        if (formData.isAuction) cy.get('[data-testid=auctionCheckbox]').click()

        cy.get('[data-testid=sendButton]').click()

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
                        .contains(formData[key], { matchCase: false })
            }
        })
    })
})
