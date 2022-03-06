import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import CategorySelectionList from './CategorySelectionList'
import { categories } from '@mewi/types'
import { MemoryRouter, Route } from 'react-router-dom'
import _ from 'lodash'
import { Provider } from 'react-redux'
import { store } from 'store'

describe('Category Selection List', () => {
    const mockCatKey = _.sample(Object.keys(categories))
    const mainCat = categories[mockCatKey || '']

    const MockCategorySelectionList = () => {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/kategorier/${mockCatKey}`]}>
                    <Route path={'/kategorier/:category_id'}>
                        <CategorySelectionList />
                    </Route>
                </MemoryRouter>
            </Provider>
        )
    }

    // mock useParams
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({
            category_id: mockCatKey,
        }),
    }))

    it('renders all main categories', () => {
        const { queryByText } = render(<MockCategorySelectionList />)

        const mainCategories = Object.keys(categories)

        for (const category of mainCategories) {
            expect(queryByText(categories[category].label)).toBeTruthy()
        }
    })

    it('renders sub categories when a main category is selected', () => {
        const { queryByText } = render(<MockCategorySelectionList />)

        const subCats = Object.keys(mainCat.subcat)

        // expect the sub categories to be displayed
        for (const category of subCats) {
            console.log(`Extects to find text ${mainCat?.subcat[category].label}`)
            expect(queryByText(mainCat?.subcat[category].label || '')).toBeTruthy()
        }
    })

    it('only renders the sub cateogires of the selected cateogry', () => {
        const { queryByText } = render(<MockCategorySelectionList />)
        const subCats = _.sample(_.omit(categories, mockCatKey || ''))?.subcat || {} // sample a category that isn't selected

        // expect the sub categories of another category not to be displayed
        for (const category of Object.keys(subCats)) {
            expect(queryByText(subCats[category].label || '')).toBeNull()
        }
    })
})
