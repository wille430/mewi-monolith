import { ClientId } from 'config/google'
import GoogleLogin from 'react-google-login'

const CustomGoogleLogin = () => {
    return (
        <GoogleLogin
            clientId={ClientId}
            uxMode='redirect'
            redirectUri={import.meta.env.VITE_API_URL + 'auth/google/redirect'}
            buttonText='Logga in med Google'
        />
    )
}

export default CustomGoogleLogin
