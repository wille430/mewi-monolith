import styles from './NavLinkItem.module.scss'
import { useAppDispatch } from '@/hooks'
import { logout } from '@/store/user'

const LogOutButton = () => {
    const dispatch = useAppDispatch()

    return (
        <form action='/api/logout' onSubmit={() => dispatch(logout())}>
            <button className={styles.link} type='submit'>
                Logga ut
            </button>
        </form>
    )
}

export default LogOutButton
