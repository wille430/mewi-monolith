import clsx from 'clsx'
import styles from './HorizontalLine.module.scss'

interface HorizontalLineProps {
    fullWidth?: boolean
    color?: string
}

export const HorizontalLine = (props: HorizontalLineProps) => {
    return (
        <hr
            color={props.color || 'lightgray'}
            className={clsx({
                [styles['hr']]: true,
                [styles['fullWidth']]: props.fullWidth,
            })}
        />
    )
}
