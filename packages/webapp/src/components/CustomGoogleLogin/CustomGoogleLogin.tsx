import { ClientId } from 'config/google'
import GoogleLogin from 'react-google-login'

const CustomGoogleLogin = () => {
    return (
        <GoogleLogin
            clientId={ClientId}
            uxMode='redirect'
            redirectUri={process.env.VITE_API_URL + 'auth/google/redirect'}
            buttonText='Logga in med Google'
            data-testid='googleLoginButton'
        />
    )
}

export default CustomGoogleLogin
