import { ItemData } from '@mewi/types'
import { toDateObj } from '@mewi/util'
import DefaultImage from 'components/DefaultImage/DefaultImage'
import { formatDistance } from 'date-fns'
import { sv } from 'date-fns/locale'
import { ReactNode } from 'react'
import OriginLabel from './OriginLabel'
import TimeUntilDate from './TimeUntilDate'

interface Props {
    props: ItemData
    id: string
    onClick?: () => void
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
            className='flex cursor-pointer flex-col overflow-hidden rounded-md border-2 border-gray-300 bg-white text-xs shadow'
            style={{ width: '270px', height: '270px' }}
            onClick={() => onClick && onClick()}
        >
            <div className='h-2/3 border-b-2 bg-white'>
                <DefaultImage
                    className={`mx-auto h-full w-full ${
                        currentImage ? 'object-cover' : 'object-cover'
                    }`}
                    src={currentImage}
                    alt={props.title}
                />
            </div>
            <div className='flex h-1/3 flex-col justify-between p-2'>
                <div>
                    <span className='flex justify-between'>
                        <span className='block h-5 overflow-hidden text-sm'>{props.title}</span>
                        <OriginLabel origin={props.origin} />
                    </span>
                    <span className='text-gray-500'>{props.region || ''}</span>
                </div>
                {/* <span>{props.body}</span> */}
                {/* <span>{props.category ? props.category[0] : ""}</span> */}
                <div className='flex w-full justify-between'>
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
