import Layout from 'components/Layout'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearFilters } from 'store/search/creators'
import SearchArea from 'components/SearchArea'

const CategorySearch = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        // clear filters on unmount
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    return (
        <Layout>
            <main className='main max-w-full'>
                <SearchArea />
            </main>
        </Layout>
    )
}

export default CategorySearch
