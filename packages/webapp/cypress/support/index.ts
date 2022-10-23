/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-real-events'
import { ListingFiltersContext } from '../../src/hooks/useListingFilters'
import { AuthTokens } from '@wille430/common'

beforeEach(() => {
    cy.log('BRRRRUUUUUUUHHH')
    cy.exec('npm run db:reset && npm run db:seed')
})

declare global {
    namespace Cypress {
        interface Chainable {
            getBySel(
                selector: string,
                args?: Partial<
                    Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow
                >
            ): Chainable<JQuery<HTMLElement>>
            getBySelLike(
                selector: string,
                args?: Partial<
                    Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow
                >
            ): Chainable<JQuery<HTMLElement>>
            login(): Chainable<{ email: string; password: string } & AuthTokens>
            authenticate(args: { email: string; password: string }): void
        }
    }
    interface Window {
        ListingFilterContext: React.Context<ListingFiltersContext | undefined>
    }
}
