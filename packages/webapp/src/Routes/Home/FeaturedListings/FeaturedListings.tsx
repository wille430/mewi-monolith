import { IListing } from '@wille430/common'
import { Container } from '@mewi/ui'
import axios from 'axios'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import StyledLoader from 'components/StyledLoader'
import _ from 'lodash'
import { useQuery } from 'react-query'
import * as styles from './FeaturedListings.module.scss'

const FeaturedListings = () => {
    const { isLoading, error, data } = useQuery(
        'featuredListings',
        () =>
            axios
                .get('/listings/featured')
                .then((res) => _.sortBy(res.data as IListing[], (x) => x.date)),
        { refetchOnWindowFocus: false }
    )
    return (
        <Container className={styles.container}>
            <h3>Produkter i blickfånget</h3>
            {isLoading ? (
                <div className={styles.loader}>
                    <StyledLoader />
                </div>
            ) : error ? (
                <span className={styles.errorText}>Ett fel inträffade</span>
            ) : (
                <>
                    <div className={styles.scrollableView}>
                        {data?.map((x) => (
                            <ArticleItem key={x.id} id={x.id} props={x} />
                        ))}
                    </div>
                </>
            )}
        </Container>
    )
}

export default FeaturedListings
