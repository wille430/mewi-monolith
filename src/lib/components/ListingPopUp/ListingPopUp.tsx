import type { IListing } from '@/common/schemas'
import classNames from 'classnames'
import { FiX } from 'react-icons/fi'
import clsx from 'clsx'
import styles from './ListingPopUp.module.scss'
import Description from './Description/Description'
import { Container } from '../Container/Container'
import { OriginLabel } from '../OriginLabel/OriginLabel'
import { PopUp } from '../PopUp/PopUp'
import DefaultImage from '../DefaultImage/DefaultImage'
import { Button } from '../Button/Button'
import { HorizontalLine } from '../HorizontalLine/HorizontalLine'
import { CategoryPathLabel } from '@/lib/components/CategoryPathLabel/CategoryPathLabel'

const cx = classNames.bind(styles)

interface ListingPopUp {
    onClose?: () => void
    listing: IListing
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
                <Container.Content className='flex flex-grow flex-col'>
                    <div className={clsx(styles['image-wrapper'], 'relative')}>
                        {/* TODO: Implement image carousel */}
                        <DefaultImage src={imageUrl[0]} fill alt={listing.title} />
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
                            <SpecificationsView parameters={parameters ?? []} />
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
                        <tr key={value}>
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
}: Pick<IListing, 'region' | 'title' | 'price' | 'redirectUrl' | 'origin'>) => {
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
