import { useAppDispatch } from '@/hooks'
import { logout } from '@/store/user'

const LogOutButton = () => {
    const dispatch = useAppDispatch()

    return (
        <form action='/api/logout' onSubmit={() => dispatch(logout())}>
            <button type='submit'>Logga ut</button>
        </form>
    )
}

export default LogOutButton
