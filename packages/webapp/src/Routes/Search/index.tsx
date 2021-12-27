import PageNav from './PageNav/index'
import FilterArea from './FilterArea'
import SortButton from './SortButton'
import ItemGrid from './ItemGrid'
import AdPlaceholder from 'common/components/AdPlaceholder'
import { SelectedItemProvider } from './ItemGrid/ItemPopUp/SelectedItemContext'
import ResultText from './ResultText'
import Layout from 'common/components/Layout'
import { useContext, useEffect } from 'react'
import { SearchContext } from 'common/context/SearchContext'

const Search = () => {
    const { getFiltersFromParams } = useContext(SearchContext)

    useEffect(() => {
        getFiltersFromParams()
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
