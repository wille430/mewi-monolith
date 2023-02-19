import {FiX} from 'react-icons/fi'
import clsx from 'clsx'
import styles from './ListingPopUp.module.scss'
import Description from './Description/Description'
import {OriginLabel} from '../OriginLabel/OriginLabel'
import {PopUp} from '../PopUp/PopUp'
import DefaultImage from '../DefaultImage/DefaultImage'
import {Button} from '../Button/Button'
import {CategoryLabel, ListingDto} from "@mewi/models"
import Link from "next/link"

interface ListingPopUp {
    onClose?: () => void
    listing: ListingDto
}

// TODO: disable scroll outside element
const ListingPopUp = ({onClose, listing}: ListingPopUp) => {
    const {category, imageUrl, title, body, region, price, origin, parameters, redirectUrl} =
        listing
    const handleClose = () => {
        onClose && onClose()
    }

    return (
        <PopUp onOutsideClick={onClose} className={styles.popUp}>
            <section className="container card max-w-4xl">
                <header className="flex justify-between">
                     <span className="space-x-2 spacers-arrow">
                        <Link href="/sok">Allt</Link>
                        <Link href={'/sok?categories=' + category}>{CategoryLabel[category]}</Link>
                    </span>
                    <Button onClick={handleClose} className="bg-transparent text-black ml-auto btn-lg"><FiX/></Button>
                </header>
                <div>
                    <div className={clsx(styles['image-wrapper'], 'relative')}>
                        {/* TODO: Implement image carousel */}
                        <DefaultImage src={imageUrl[0]} alt={listing.title}/>
                    </div>

                    <hr/>

                    <article className="flex flex-col flex-grow">
                        <div className="p-2 pt-4 grid grid-cols-[1fr_12rem]">
                            <div>
                                <span className="h-2 text-muted">{region}</span>
                                <h4>{title}</h4>
                                {price && (
                                    <span>
                                        {Intl.NumberFormat("sv-SE", {
                                            style: "currency",
                                            currency: price.currency
                                        }).format(price.value)}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col items-end">
                                <OriginLabel origin={origin}/>
                                <Link className="btn" href={redirectUrl} target="_blank">
                                    Till artikeln {">>"}
                                </Link>
                            </div>
                        </div>
                        <hr/>
                        <div className="flex-grow lg:flex lg:gap-2">
                            <div data-content-length={body?.length ?? 0}
                                 className={clsx("box h-full flex-grow", styles.description)}>
                                <h4>Beskrivning</h4>
                                <Description text={body || ''}/>
                            </div>

                            <hr/>

                            <SpecificationsView parameters={parameters ?? []}/>
                        </div>
                    </article>
                </div>
            </section>
        </PopUp>
    )
}

export default ListingPopUp

const SpecificationsView = ({parameters}) =>
    parameters.length ? (
        <aside className={clsx('box', styles['specs'])}>
            <h4>Specifikationer</h4>
            <table className={styles['specs-table']}>
                <tbody>
                {parameters?.map(({label, value}) => (
                    <tr key={value}>
                        <td>{label}:</td>
                        <td>{value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </aside>
    ) : (
        <aside className={styles['specs-hidden']}/>
    )
