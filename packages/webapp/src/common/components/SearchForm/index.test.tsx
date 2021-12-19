import React from "react"
import { render, fireEvent } from "@testing-library/react"
import SearchForm from './index'
import { act } from "react-dom/test-utils"

const mockHistoryPush = jest.fn()
const mockAutoComplete = jest.fn(() => [])

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}))

jest.mock('api/SearchAPI', () => {
    return {
        __esModule: true,
        default: {
            autocomplete: async () => mockAutoComplete
        }
    }
})

it('renders correctly', () => {
    const { queryByTestId, queryByPlaceholderText } = render(<SearchForm />)

    expect(queryByTestId("searchButton")).toBeTruthy()
    expect(queryByPlaceholderText("Sök efter en vara...")).toBeTruthy()
})

describe('Input value', () => {
    it('updates on change', () => {
        const { queryByTestId } = render(<SearchForm />)

        const searchInput = queryByTestId('searchInput') as HTMLButtonElement

        expect(searchInput).toBeTruthy()
        if (!searchInput) return

        const inputText = "test"

        act(() => {
            fireEvent.change(searchInput, {
                target: {
                    value: inputText
                }
            })
        })

        expect(searchInput.value).toBe(inputText)
    })
})

describe('Search button', () => {
    it('triggers page redirect', () => {
        const handleSearch = jest.fn()

        const { queryByTestId } = render(<SearchForm />)
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

            const { queryByTestId } = render(<SearchForm />)

            const searchSuggestions = queryByTestId('searchSuggestions')
            const searchInput = queryByTestId('searchInput')

            expect(searchSuggestions).toBeTruthy()
            expect(searchInput).toBeTruthy()

            if (!searchSuggestions) throw new Error('searchSuggestions is not defined')
            if (!searchInput) throw new Error('searchInput is not defined')

            fireEvent.change(searchInput, {
                target: {
                    value: ""
                }
            })

            expect(mockAutoComplete).toHaveBeenCalledTimes(1)

        })
    })

    describe('with query', () => {
        it('triggers autocomplete api function', () => {

            const { queryByTestId } = render(<SearchForm />)

            const searchSuggestions = queryByTestId('searchSuggestions')
            const searchInput = queryByTestId('searchInput')

            expect(searchSuggestions).toBeTruthy()
            expect(searchInput).toBeTruthy()

            if (!searchSuggestions) throw new Error('searchSuggestions is not defined')
            if (!searchInput) throw new Error('searchInput is not defined')

            fireEvent.change(searchInput, {
                target: {
                    value: "volvo"
                }
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