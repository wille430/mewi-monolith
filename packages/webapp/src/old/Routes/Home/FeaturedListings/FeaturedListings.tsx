import { Container } from '@mewi/ui'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import style from './FeaturedListings.module.scss'
import { Listing } from '@prisma/client'

const FeaturedListings = ({ listings }: { listings?: Listing[] }) => {
    return (
        <Container className={style.container}>
            <h3>Produkter i blickfånget</h3>
            {listings.length === 0 ? (
                <span className={style.emptyText}>
                    Det finns inga produkter i blickfånget för tillfället
                </span>
            ) : (
                <>
                    <div className={style.scrollableView}>
                        {listings?.map((x) => (
                            <ArticleItem key={x.id} id={x.id} props={x} />
                        ))}
                    </div>
                </>
            )}
        </Container>
    )
}

export default FeaturedListings
