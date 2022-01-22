import PageNav from '../../components/PageNav/index'
import FilterArea from '../../components/FilterArea'
import SortButton from 'components/SortButton'
import ItemGrid from '../../components/ItemGrid'
import ResultText from '../../components/ResultText'
import Layout from 'components/Layout'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { clearFilters, getFiltersFromQueryParams } from 'store/search/creators'

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
                <section
                    className='col-start-2 flex-none w-full'
                    style={{
                        maxWidth: '960px',
                    }}
                >
                    {/* <AdPlaceholder size='lg' className='mb-12' /> */}

                    <div ref={scrollEle}>
                        <FilterArea />
                    </div>
                    
                    <div ref={scrollEle}></div>
                    <div className='w-full flex justify-between py-2 pb-6'>
                        <ResultText />
                        <SortButton />
                    </div>

                    <ItemGrid />

                    <PageNav anchorEle={scrollEle} />
                </section>
            </main>
            <aside className='side-col space-y-16'>
                {/* <AdPlaceholder />
                <AdPlaceholder /> */}
            </aside>
        </Layout>
    )
}

export default Search
