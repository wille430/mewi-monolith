
describe('watchers', () => {
    let accessToken

    beforeEach(() => {
        cy.request('post', 'http://localhost:3001/test/user').then(res => {
            accessToken = res.body.jwt
        })
        cy.visit('/minabevakningar')
    })

    it('it can create a new watcher and display it', () => {

        cy.get('[data-testid=createNewWatcherButton]').click()

        cy.get('[data-testid=keywordInput]').type('hello world')

        cy.get('[data-testid=sendButton]').click()

        cy.contains('hello world')
        
    })
})