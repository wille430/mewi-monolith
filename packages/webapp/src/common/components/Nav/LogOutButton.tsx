import { UserContext } from "common/context/UserContext"
import { useContext } from "react"

const LogOutButton = () => {

    const { logOut } = useContext(UserContext)

    return (
        <button onClick={e => logOut()}>Logga ut</button>
    )
}

export default LogOutButton