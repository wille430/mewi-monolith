
import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { logOut } from 'store/auth/creators'

const LogOutButton = () => {

    const dispatch = useDispatch()

    return <button onClick={(e) => {
        dispatch(logOut())
    }}>Logga ut</button>
}

export default LogOutButton
