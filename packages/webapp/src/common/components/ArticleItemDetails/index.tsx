import { ItemData } from '@mewi/types'
import { capitalize } from '@mewi/util'
import styles from './index.module.scss'
import classNames from 'classnames'
import Container, { ContainerContent, ContainerFooter, ContainerHeader } from '../Container'
import ImageDisplay from '../ImageDisplay'
import HorizontalLine from '../HorizontalLine'
import Button from '../Button'
import OriginLabel from '../ArticleItem/OriginLabel'
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
    const categoryPathString = category.map((string) => capitalize(string)).join(' > ')

    const handleClose = () => {
        onClose && onClose()
    }

    const handleRedirect = () => {
        window.open(redirectUrl)
    }

    return (
        <Container>
            <ContainerHeader className={styles.header}>
                <span
                    className={cx({
                        [styles.categoryPath]: true,
                    })}
                >
                    {categoryPathString}
                </span>
                <span>
                    <Button onClick={handleClose}  variant="text" icon={<FiX />} />
                </span>
            </ContainerHeader>
            <ContainerContent>
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
                            <Button variant='text' label='Gå till artikeln >>' onClick={handleRedirect} />
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
            </ContainerContent>
            <ContainerFooter />
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
