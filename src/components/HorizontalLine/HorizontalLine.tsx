import classNames from 'classnames'
import styles from './HorizontalLine.module.scss'

const cx = classNames.bind(styles)

interface HorizontalLineProps {
    fullWidth?: boolean
    color?: string
}

export const HorizontalLine = (props: HorizontalLineProps) => {
    return (
        <hr
            color={props.color || 'lightgray'}
            className={cx({
                [styles['hr']]: true,
                [styles['fullWidth']]: props.fullWidth,
            })}
        />
    )
}
