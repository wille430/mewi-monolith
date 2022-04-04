import { IListing } from '@mewi/common/types'
import axios from 'axios'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import StyledLoader from 'components/StyledLoader'
import _ from 'lodash'
import { useQuery } from 'react-query'

const FeaturedListings = () => {
    const { isLoading, error, data } = useQuery('featuredListings', () =>
        axios
            .get('/listings/featured')
            .then((res) => _.sortBy(res.data as IListing[], (x) => x.date))
    )
    return (
        <section className='mx-auto w-fit max-w-full flex-grow overflow-x-hidden py-12 px-2'>
            {isLoading ? (
                <StyledLoader />
            ) : error ? (
                <span>Ett fel inträffade</span>
            ) : (
                <>
                    <h3>Produkter i blickfånget</h3>
                    <div className='flex space-x-4 overflow-x-auto scroll-smooth'>
                        {data?.map((x) => (
                            <ArticleItem key={x.id} id={x.id} props={x} />
                        ))}
                    </div>
                </>
            )}
        </section>
    )
}

export default FeaturedListings
