import { setJwt } from '@/lib/jwt'

const LogOutButton = () => {
    return (
        <form action='/api/logout' onSubmit={() => setJwt()}>
            <button type='submit'>Logga ut</button>
        </form>
    )
}

export default LogOutButton
