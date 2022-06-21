import { Button } from '@wille430/ui'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

interface ExpandedButtonProps {
    handleExpand: () => void
    expand: boolean
}

const ExpandButton = ({ handleExpand, expand }: ExpandedButtonProps) => {
    return (
        <Button
            onClick={handleExpand}
            variant='text'
            className='text-black'
            icon={expand ? <BiChevronUp size={24} /> : <BiChevronDown size={24} />}
        />
    )
}

export default ExpandButton
