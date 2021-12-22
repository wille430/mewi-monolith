import { UserContext } from 'common/context/UserContext'
import { useContext } from 'react'

const LogOutButton = () => {
    const { userDispatch } = useContext(UserContext)

    return <button onClick={(e) => userDispatch({ type: 'logout' })}>Logga ut</button>
}

export default LogOutButton
