import * as styles from './style'

const NavEndButton = ({ onClick, icon, ...rest }) => {
    return (
        <styles.Button onClick={onClick} {...rest}>
            {icon()}
        </styles.Button>
    )
}

export default NavEndButton
