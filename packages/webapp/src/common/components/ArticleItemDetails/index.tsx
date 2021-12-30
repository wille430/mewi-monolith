import { ItemData } from '@mewi/types'
import { capitalize } from '@mewi/util'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Container } from '@mewi/ui'
import ImageDisplay from '../ImageDisplay'
import { HorizontalLine } from '@mewi/ui'
import OriginLabel from '../ArticleItem/OriginLabel'
import { Button } from '@mewi/ui'
import { FiX } from 'react-icons/fi'

const cx = classNames.bind(styles)

interface ArticleItemDetails extends ItemData {
    onClose?: () => void
}

const ArticleItemDetails = ({
    category,
    imageUrl,
    title,
    body,
    region,
    price,
    origin,
    parameters,
    redirectUrl,
    onClose,
    ...rest
}: ArticleItemDetails) => {
    const categoryPathString = Object.values(category)
        .map((value) => capitalize(value || ''))
        .join(' > ')

    const handleClose = () => {
        onClose && onClose()
    }

    const handleRedirect = () => {
        window.open(redirectUrl)
    }

    return (
        <Container>
            <Container.Header className={styles.header}>
                <span
                    className={cx({
                        [styles.categoryPath]: true,
                    })}
                >
                    {categoryPathString}
                </span>
                <span>
                    <Button onClick={handleClose} variant='text' icon={<FiX />} />
                </span>
            </Container.Header>
            <Container.Content>
                <ImageDisplay imageUrls={imageUrl} />
                <HorizontalLine />
                <article>
                    <header className={styles.infoHeader}>
                        <div>
                            <span>{region}</span>
                            <h3>{title}</h3>
                            <h4>{`${price.value} ${price.currency}`}</h4>
                        </div>
                        <div>
                            <h4 className={styles.originLabel}>
                                <OriginLabel {...{ origin }} />
                            </h4>
                            <Button
                                variant='text'
                                label='Gå till artikeln >>'
                                onClick={handleRedirect}
                            />
                        </div>
                    </header>
                    <HorizontalLine />
                    <div className={styles.infoBody}>
                        <div>
                            <h4>Beskrivning</h4>
                            <p>{body}</p>
                        </div>
                        <HorizontalLine />
                        <aside>
                            <h4>Specifikationer</h4>
                            <Specifications specs={parameters} />
                        </aside>
                    </div>
                    <footer></footer>
                </article>
            </Container.Content>
            <Container.Footer />
        </Container>
    )
}

const Specifications = ({ specs }: { specs: ItemData['parameters'] }) => (
    <table className={styles.specifications}>
        {specs?.map(({ label, value }) => (
            <tr>
                <td>{label}:</td>
                <td>{value}</td>
            </tr>
        ))}
    </table>
)

export default ArticleItemDetails
