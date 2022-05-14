import { Listing } from '@mewi/prisma'
import styles from './ListingPopUp.module.scss'
import classNames from 'classnames'
import { Container } from '@mewi/ui'
import { HorizontalLine } from '@mewi/ui'
import { OriginLabel } from '../OriginLabel/OriginLabel'
import { Button } from '@mewi/ui'
import { FiX } from 'react-icons/fi'
import Description from './Description/Description'
import { CategoryPathLabel } from '@/components/CategoryPathLabel/CategoryPathLabel'
import { PopUp } from '../PopUp/PopUp'
import DefaultImage from '../DefaultImage/DefaultImage'

const cx = classNames.bind(styles)

interface ArticleItemDetails {
    onClose?: () => void
    listing: Listing
}

// TODO: disable scroll outside element
const ArticleItemDetails = ({ onClose, listing }: ArticleItemDetails) => {
    const { category, imageUrl, title, body, region, price, origin, parameters, redirectUrl } =
        listing
    const handleClose = () => {
        onClose && onClose()
    }

    const handleRedirect = () => {
        window.open(redirectUrl)
    }

    return (
        <PopUp onOutsideClick={onClose}>
            <Container className={styles.container}>
                <Container.Header className={styles.header}>
                    <span
                        className={cx({
                            [styles.categoryPath]: true,
                        })}
                    >
                        <CategoryPathLabel category={category} />
                    </span>
                    <span>
                        <Button onClick={handleClose} variant='text' icon={<FiX />} />
                    </span>
                </Container.Header>
                <Container.Content>
                    <div className={styles.imageWrapper}>
                        {/* TODO: Implement image carousel */}
                        <DefaultImage src={imageUrl[0]} />
                    </div>
                    <HorizontalLine />
                    <article>
                        <header className={styles.infoHeader}>
                            <div>
                                <span>{region}</span>
                                <h3>{title}</h3>
                                {price && <h4>{`${price.value} ${price.currency}`}</h4>}
                            </div>
                            <div>
                                <h4 className={styles.originLabel}>
                                    <OriginLabel {...{ origin }} />
                                </h4>
                                <Button
                                    color='secondary'
                                    label='Gå till artikeln >>'
                                    onClick={handleRedirect}
                                />
                            </div>
                        </header>
                        <HorizontalLine />
                        <div className={styles.infoBody}>
                            <div>
                                <h4>Beskrivning</h4>
                                <Description text={body || ''} />
                            </div>
                            {parameters.length > 0 && (
                                <>
                                    <HorizontalLine />
                                    <aside>
                                        <h4>Specifikationer</h4>
                                        <Specifications specs={parameters} />
                                    </aside>
                                </>
                            )}
                        </div>
                        <footer></footer>
                    </article>
                </Container.Content>
                <Container.Footer />
            </Container>
        </PopUp>
    )
}

const Specifications = ({ specs }: { specs: Listing['parameters'] }) => (
    <table className={styles.specifications}>
        <tbody>
            {specs?.map(({ label, value }) => (
                <tr>
                    <td>{label}:</td>
                    <td>{value}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default ArticleItemDetails
