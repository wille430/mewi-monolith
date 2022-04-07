import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import CategorySelectionList from './CategorySelectionList'
import { Category, CategoryLabel } from '@wille430/common/types'
import _ from 'lodash'
import { Provider } from 'react-redux'
import { store } from 'store'
import { MemoryRouter } from 'react-router'

describe('Category Selection List', () => {
    // vi.mock('react-router-dom', () => ({
    //     useParams: () => ({
    //         category_id: _.sample(Object.keys(Category)),
    //     }),
    // }))

    const MockCategorySelectionList = () => (
        <Provider store={store}>
            <MemoryRouter initialEntries={['/kategorier/' + _.sample(Object.keys(Category))]}>
                <CategorySelectionList />
            </MemoryRouter>
        </Provider>
    )

    it('renders correctly', () => {
        const { queryByText } = render(<MockCategorySelectionList />)

        const mainCategories = Object.keys(Category)

        for (const category of mainCategories) {
            expect(queryByText(CategoryLabel[category])).toBeTruthy()
        }
    })

    // it('renders sub categories when a main category is selected', () => {
    //     const { queryByText } = render(<MockCategorySelectionList />)

    //     const subCats = Object.keys(mainCat.subcat)

    //     // expect the sub categories to be displayed
    //     for (const category of subCats) {
    //         console.log(`Extects to find text ${mainCat?.subcat[category].label}`)
    //         expect(queryByText(mainCat?.subcat[category].label || '')).toBeTruthy()
    //     }
    // })

    // it('only renders the sub cateogires of the selected cateogry', () => {
    //     const { queryByText } = render(<MockCategorySelectionList />)
    //     const subCats = _.sample(_.omit(categories, mockCatKey || ''))?.subcat || {} // sample a category that isn't selected

    //     // expect the sub categories of another category not to be displayed
    //     for (const category of Object.keys(subCats)) {
    //         expect(queryByText(subCats[category].label || '')).toBeNull()
    //     }
    // })
})
