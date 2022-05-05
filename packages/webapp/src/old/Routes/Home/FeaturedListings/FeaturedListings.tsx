import { Container } from '@mewi/ui'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import style from './FeaturedListings.module.scss'
import StyledLoader from 'components/StyledLoader'
import { useQuery } from 'react-query'
import axios from 'axios'
import _ from 'lodash'
import { Listing } from '@prisma/client'

const FeaturedListings = ({ listings }: { listings?: Listing[] }) => {
    const { isLoading, error, data } = listings
        ? {
              isLoading: false,
              error: false,
              data: listings,
          }
        : useQuery(
              'featuredListings',
              () =>
                  axios
                      .get('/listings/featured')
                      .then((res) => _.sortBy(res.data as Listing[], (x) => x.date)),
              { refetchOnWindowFocus: false }
          )

    return (
        <Container className={style.container}>
            <h3>Produkter i blickfånget</h3>
            {isLoading ? (
                <div className={style.loader}>
                    <StyledLoader />
                </div>
            ) : error ? (
                <span className={style.errorText}>Ett fel inträffade</span>
            ) : data.length === 0 ? (
                <span className={style.emptyText}>
                    Det finns inga produkter i blickfånget för tillfället
                </span>
            ) : (
                <>
                    <div className={style.scrollableView}>
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
