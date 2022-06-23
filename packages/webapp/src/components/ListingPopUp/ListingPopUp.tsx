import { Listing } from '@mewi/prisma'
import classNames from 'classnames'
import { Container } from '@wille430/ui'
import { HorizontalLine } from '@wille430/ui'
import { Button } from '@wille430/ui'
import { FiX } from 'react-icons/fi'
import clsx from 'clsx'
import styles from './ListingPopUp.module.scss'
import Description from './Description/Description'
import { OriginLabel } from '../OriginLabel/OriginLabel'
import { PopUp } from '../PopUp/PopUp'
import DefaultImage from '../DefaultImage/DefaultImage'
import { CategoryPathLabel } from '@/components/CategoryPathLabel/CategoryPathLabel'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { closeListing } from '@/store/listings'

const cx = classNames.bind(styles)

interface ListingPopUp {
    onClose?: () => void
    listing: Listing
}

export const ListingPopUpContainer = () => {
    const listing = useAppSelector((state) => state.listings.opened)
    const dispatch = useAppDispatch()

    const handleClose = () => dispatch(closeListing())

    if (!listing) {
        return null
    }

    return <ListingPopUp onClose={handleClose} listing={listing} />
}

// TODO: disable scroll outside element
const ListingPopUp = ({ onClose, listing }: ListingPopUp) => {
    const { category, imageUrl, title, body, region, price, origin, parameters, redirectUrl } =
        listing
    const handleClose = () => {
        onClose && onClose()
    }

    return (
        <PopUp onOutsideClick={onClose} className={styles.popUp}>
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
                        <Button onClick={handleClose} variant='text' size='lg' icon={<FiX />} />
                    </span>
                </Container.Header>
                <Container.Content className='flex flex-col flex-grow'>
                    <div className={styles['image-wrapper']}>
                        {/* TODO: Implement image carousel */}
                        <DefaultImage src={imageUrl[0]} />
                    </div>
                    <article className={styles.content}>
                        <InfoHeader
                            region={region}
                            title={title}
                            price={price}
                            redirectUrl={redirectUrl}
                            origin={origin}
                        />
                        <HorizontalLine />
                        <div className={styles['info-body']}>
                            <DescriptionView body={body} />
                            <HorizontalLine />
                            <SpecificationsView parameters={parameters} />
                        </div>
                    </article>
                </Container.Content>
                <Container.Footer />
            </Container>
        </PopUp>
    )
}

const DescriptionView = ({ body }) => (
    <div data-content-length={body?.length ?? 0} className={clsx('box', styles.description)}>
        <h4>Beskrivning</h4>
        <Description text={body || ''} />
    </div>
)

export default ListingPopUp

const SpecificationsView = ({ parameters }) =>
    parameters.length ? (
        <aside className={clsx('box', styles['specs'])}>
            <h4>Specifikationer</h4>
            <table className={styles['specs-table']}>
                <tbody>
                    {parameters?.map(({ label, value }) => (
                        <tr>
                            <td>{label}:</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </aside>
    ) : (
        <aside className={styles['specs-hidden']} />
    )

const InfoHeader = ({
    region,
    title,
    price,
    redirectUrl,
    origin,
}: Pick<Listing, 'region' | 'title' | 'price' | 'redirectUrl' | 'origin'>) => {
    const handleRedirect = () => {
        window.open(redirectUrl)
    }

    return (
        <header className={styles['info-header']}>
            <div>
                <span className={styles['region-text']}>{region}</span>
                <h3 className={styles['title-text']}>{title}</h3>
                {price && (
                    <span
                        className={styles['price-text']}
                    >{`${price.value} ${price.currency}`}</span>
                )}
            </div>
            <div>
                <OriginLabel origin={origin} />
                <Button label='Till artikeln >>' size='lg' onClick={handleRedirect} />
            </div>
        </header>
    )
}
