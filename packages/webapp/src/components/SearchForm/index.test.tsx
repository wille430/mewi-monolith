import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SearchForm from './index'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { store } from 'store'

const mockHistoryPush = jest.fn()
const mockAutoComplete = jest.fn(() => [])

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

jest.mock('api/SearchAPI', () => {
    return {
        __esModule: true,
        default: {
            autocomplete: async () => mockAutoComplete,
        },
    }
})

const MockSearchForm = () => (
    <Provider store={store}>
        <SearchForm showSearchIcon={true} />
    </Provider>
)

it('renders correctly', () => {
    const { queryByTestId, queryByPlaceholderText } = render(<MockSearchForm />)

    expect(queryByTestId('searchButton')).toBeTruthy()
    expect(queryByPlaceholderText('Sök efter en vara...')).toBeTruthy()
})

describe('Input value', () => {
    it('updates on change', () => {
        const { queryByTestId } = render(<MockSearchForm />)

        const searchInput = queryByTestId('searchInput') as HTMLButtonElement

        expect(searchInput).toBeTruthy()
        if (!searchInput) return

        const inputText = 'test'

        act(() => {
            fireEvent.change(searchInput, {
                target: {
                    value: inputText,
                },
            })
        })

        expect(searchInput.value).toBe(inputText)
    })
})

describe('Search button', () => {
    it('triggers page redirect', () => {
        const { queryByTestId } = render(<MockSearchForm />)
        const searchButton = queryByTestId('searchButton')
        expect(searchButton).toBeTruthy()

        if (!searchButton) throw new Error('searchButton is not defined')

        fireEvent.click(searchButton)

        expect(mockHistoryPush).toHaveBeenCalled()
    })
})

describe('Search Suggestions', () => {
    describe('with no query', () => {
        it('does not trigger autocomplete api function', () => {
            const { queryByTestId } = render(<MockSearchForm />)

            const searchSuggestions = queryByTestId('searchSuggestions')
            const searchInput = queryByTestId('searchInput')

            expect(searchSuggestions).toBeTruthy()
            expect(searchInput).toBeTruthy()

            if (!searchSuggestions) throw new Error('searchSuggestions is not defined')
            if (!searchInput) throw new Error('searchInput is not defined')

            fireEvent.change(searchInput, {
                target: {
                    value: '',
                },
            })

            expect(mockAutoComplete).toHaveBeenCalledTimes(0)
        })
    })

    describe('with query', () => {
        it('triggers autocomplete api function', () => {
            const { queryByTestId } = render(<MockSearchForm />)

            const searchSuggestions = queryByTestId('searchSuggestions')
            const searchInput = queryByTestId('searchInput')

            expect(searchSuggestions).toBeTruthy()
            expect(searchInput).toBeTruthy()

            if (!searchSuggestions) throw new Error('searchSuggestions is not defined')
            if (!searchInput) throw new Error('searchInput is not defined')

            fireEvent.change(searchInput, {
                target: {
                    value: 'volvo',
                },
            })

            new Promise<void>((resolve, reject) => {
                return setTimeout(() => {
                    expect(mockAutoComplete).toHaveBeenCalledTimes(2)
                    resolve()
                }, 5000)
            })
        })
    })
})
