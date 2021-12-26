import styles from './index.module.scss'
import classNames from 'classnames'

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
