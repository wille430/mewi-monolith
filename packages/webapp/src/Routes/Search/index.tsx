import PageNav from '../../components/PageNav/index'
import FilterArea from '../../components/FilterArea'
import SortButton from 'components/SortButton'
import ItemGrid from '../../components/ItemGrid'
import ResultText from '../../components/ResultText'
import Layout from 'components/Layout'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { clearFilters, getFiltersFromQueryParams } from 'store/search/creators'
import CategorySelectionList from 'components/CategorySelectionList'

const Search = () => {
    const dispatch = useDispatch()
    const scrollEle = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        dispatch(getFiltersFromQueryParams())

        // clear filters on unmount
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main pb-32'>
                <div className='flex flex-col gap-8 lg:flex-row lg:gap-4'>
                    <CategorySelectionList />
                    <div className=''>
                        <div ref={scrollEle}>
                            <FilterArea exclude={{ category: true }} showKeywordField />
                        </div>

                        <div className='flex w-full justify-between py-2 pb-6'>
                            <ResultText />
                            <SortButton />
                        </div>

                        <ItemGrid />

                        <PageNav anchorEle={scrollEle} />
                    </div>
                </div>
            </main>
            <aside className='side-col space-y-16'>
                {/* <AdPlaceholder />
                <AdPlaceholder /> */}
            </aside>
        </Layout>
    )
}

export default Search
