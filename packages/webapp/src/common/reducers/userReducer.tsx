import { login, refreshJwtToken, signUp } from 'api'
import { useReducer } from 'react'
import { APIResponseError, AuthTokens } from '@mewi/types'

interface UserState {
    isLoading: boolean
}

export type UserReducerAction =
    | { type: 'refreshTokens'; callback?: (newAuthTokens: AuthTokens) => void }
    | {
          type: 'login'
          userCredentials: { email: string; password: string }
          callback?: (authTokens: AuthTokens | undefined, err?: APIResponseError) => void
      }
    | {
          type: 'signup'
          signUpCredentials: { email: string; password: string; repassword: string }
          callback?: (authTokens: AuthTokens | undefined, err?: APIResponseError) => void
      }
    | { type: 'logout' }

interface userReducerProps {
    authTokens: AuthTokens
    setAuthTokens: (newVal: AuthTokens) => void
}

const userReducer = ({ authTokens, setAuthTokens }: userReducerProps) => {
    const initState: UserState = {
        isLoading: true,
    }

    const reducer = (state: UserState, action: UserReducerAction): UserState => {
        switch (action.type) {
            case 'refreshTokens':
                if (!authTokens.refreshToken) break
                refreshJwtToken(authTokens.refreshToken).then(setAuthTokens)
                break
            case 'login':
                const { email, password } = action.userCredentials
                login(email, password)
                    .then((tokens) => {
                        setAuthTokens(tokens)
                        action.callback && action.callback(tokens)
                    })
                    .catch((e) => {
                        action.callback && action.callback(undefined, e)
                    })
                break
            case 'signup':
                const signUpFields = action.signUpCredentials
                signUp(signUpFields.email, signUpFields.password, signUpFields.repassword)
                    .then((tokens) => {
                        setAuthTokens(tokens)
                        action.callback && action.callback(tokens)
                    })
                    .catch((e) => {
                        action.callback && action.callback(undefined, e)
                    })
                break
            case 'logout':
                setAuthTokens({})
                break
        }
        return state
    }

    const [state, dispatch] = useReducer(reducer, initState)

    return { userState: state, userDispatch: dispatch }
}

export default userReducer
