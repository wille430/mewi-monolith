import { useDispatch } from 'react-redux'

const LogOutButton = () => {
    return (
        <button
            onClick={(e) => {
                // dispatch(logOut())
            }}
        >
            Logga ut
        </button>
    )
}

export default LogOutButton
