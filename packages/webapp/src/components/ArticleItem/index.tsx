import { toDateObj } from '@mewi/util'
import missingImage from 'assets/missingImage.png'
import { formatDistance } from 'date-fns'
import { sv } from 'date-fns/locale'
import { ItemData } from 'models/types'
import { ReactNode } from 'react'
import OriginLabel from './OriginLabel'
import TimeUntilDate from './TimeUntilDate'

interface Props {
    props: ItemData
    id: string
    onClick: () => void
}

const ArticleItem = ({ props, onClick }: Props) => {
    const currentImage = props.imageUrl[0]

    let dateComponent: ReactNode

    if (props.date) {
        dateComponent = (
            <span className='block text-gray-500'>
                {formatDistance(toDateObj(props.date), new Date(), {
                    addSuffix: true,
                    locale: sv,
                }).replace('ungefär', 'ca.')}
            </span>
        )
    } else if (props.endDate) {
        dateComponent = <TimeUntilDate endDate={props.endDate} />
    }

    return (
        <div
            className='rounded-md border-2 border-gray-300 text-xs flex flex-col shadow cursor-pointer bg-white overflow-hidden'
            style={{ width: '270px', height: '270px' }}
            onClick={() => onClick()}
        >
            <div className='bg-white h-2/3 border-b-2'>
                <img
                    className={`mx-auto h-full w-full ${
                        currentImage ? 'object-cover' : 'object-cover'
                    }`}
                    src={currentImage || missingImage}
                    alt={props.title}
                />
            </div>
            <div className='p-2 h-1/3 flex flex-col justify-between'>
                <div>
                    <span className='flex justify-between'>
                        <span className='block text-sm h-5 overflow-hidden'>{props.title}</span>
                        <OriginLabel origin={props.origin} />
                    </span>
                    <span className='text-gray-500'>{props.region || ''}</span>
                </div>
                <span>{props.description}</span>
                {/* <span>{props.category ? props.category[0] : ""}</span> */}
                <div className='w-full flex justify-between'>
                    {props.price && props.price.value && props.price.currency && (
                        <span>
                            {props.price.value} {props.price.currency}
                        </span>
                    )}
                    {dateComponent}
                </div>
            </div>
        </div>
    )
}

export default ArticleItem
