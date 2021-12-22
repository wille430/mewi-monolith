import * as styles from './style'

const NavEndButton = ({ onClick, icon }) => {
    return <styles.Button onClick={onClick}>{icon()}</styles.Button>
}

export default NavEndButton
