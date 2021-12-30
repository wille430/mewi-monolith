import PageNav from './PageNav/index'
import FilterArea from './FilterArea'
import SortButton from './SortButton'
import ItemGrid from './ItemGrid'
import AdPlaceholder from 'common/components/AdPlaceholder'
import { SelectedItemProvider } from './ItemGrid/ItemPopUp/SelectedItemContext'
import ResultText from './ResultText'
import Layout from 'common/components/Layout'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearFilters, getSearchResults, setFilters } from 'store/search/creators'
import { useLocation } from 'react-router'
import queryString from 'query-string'
import { useAppSelector } from 'common/hooks/hooks'

const Search = () => {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(setFilters(queryString.parse(location.search)))

        // clear filters on unmount
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main pb-32'>
                <section
                    className='col-start-2 flex-none w-full'
                    style={{
                        maxWidth: '960px',
                    }}
                >
                    <AdPlaceholder size='lg' className='mb-12' />

                    <FilterArea />
                    <div className='w-full flex justify-between py-2 pb-6'>
                        <ResultText />
                        <SortButton />
                    </div>

                    <SelectedItemProvider>
                        <ItemGrid />
                    </SelectedItemProvider>

                    <PageNav />
                </section>
            </main>
            <aside className='side-col space-y-16'>
                <AdPlaceholder />
                <AdPlaceholder />
            </aside>
        </Layout>
    )
}

export default Search
