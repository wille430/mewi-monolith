import Layout from 'components/Layout'
import SearchArea from 'components/SearchArea'

const Search = () => {
    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main max-w-full'>
                <SearchArea />
            </main>
            <aside className='side-col space-y-16'></aside>
        </Layout>
    )
}

export default Search
