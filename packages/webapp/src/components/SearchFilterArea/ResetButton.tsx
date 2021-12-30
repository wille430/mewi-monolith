import { Button } from '@mewi/ui'

export interface ResetButtonProps {
    onClick?: () => void
}

const ResetButton = ({ onClick }: ResetButtonProps) => {
    return (
        <Button
            type='reset'
            variant='text'
            onClick={() => {
                onClick && onClick()
            }}
            label='Ta bort filter'
            defaultCasing
        />
    )
}

export default ResetButton
