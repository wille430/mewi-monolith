import { formatDistance } from 'date-fns'
import { FiClock } from 'react-icons/fi'
import { toDateObj } from '@mewi/util'
import { sv } from 'date-fns/locale'

interface Props {
    endDate: number
}

const TimeUntilDate = ({ endDate }: Props) => {
    const dateText = formatDistance(toDateObj(endDate), Date.now(), {
        addSuffix: true,
        locale: sv,
    }).replace('ungefär', 'ca.')
    const millisecondsAway = endDate - Date.now()
    const endingSoon = millisecondsAway < 48 * 60 * 60 * 1000

    if (millisecondsAway > 0) {
        return (
            <div className={`flex items-center space-x-1 ${endingSoon ? 'text-red-600' : ''}`}>
                <FiClock />
                <span>{dateText}</span>
            </div>
        )
    } else {
        return <span className='italic text-gray-400'>Utgånget</span>
    }
}

export default TimeUntilDate
