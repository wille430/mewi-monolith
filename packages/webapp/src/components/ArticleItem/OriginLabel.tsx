import { ItemData } from "@mewi/types"

interface Props {
    origin: ItemData['origin']
}

const OriginLabel = ({ origin }: Props) => {
    let className = 'h-full my-auto '

    switch (origin) {
        case 'Blocket':
            className += 'text-red-400'
            break
        case 'Tradera':
            className += 'text-green-500'
            break
        case 'Sellpy':
            className += 'text-gray-700'
            break
        default:
            break
    }

    return <span className={className}>{origin}</span>
}

export default OriginLabel
