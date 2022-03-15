import { ItemData } from '@mewi/types'
import axios from 'axios'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import _ from 'lodash'
import { useQuery } from 'react-query'

const FeaturedListings = () => {
    const { isLoading, error, data } = useQuery('featuredListings', () =>
        axios.get('/featured').then((res) => _.sortBy(res.data as ItemData[], (x) => x.date))
    )

    if (isLoading) {
        return <span>Loading feauted items...</span>
    } else if (error) {
        return <span>An error occurred</span>
    } else {
        return (
            <section className='mx-auto w-fit max-w-full overflow-visible py-12'>
                <h3>I blickfånget</h3>
                <div className='flex space-x-4'>
                    {data?.map((x) => (
                        <ArticleItem id={x.id} props={x} />
                    ))}
                </div>
            </section>
        )
    }
}

export default FeaturedListings
