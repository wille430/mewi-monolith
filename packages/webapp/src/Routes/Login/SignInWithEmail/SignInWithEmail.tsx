import { Link } from 'react-router-dom'
import { Button, TextField } from '@mewi/ui'
import { useState } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'
import { useAppDispatch } from 'hooks/hooks'
import { loginUser } from 'store/auth/creators'
import { AuthTokens } from '@wille430/common'
import CustomGoogleLogin from 'components/CustomGoogleLogin/CustomGoogleLogin'
import SmallContainer from 'components/SmallContainer/SmallContainer'

export function SignInWithEmail() {
    const [email, setEmail] = useState<string | undefined>('')
    const [password, setPassword] = useState<string | undefined>('')
    const dispatch = useAppDispatch()

    const [error, setError] = useState('')
    const loginMutation = useMutation(
        async () => await axios.post('/auth/login', { email, password }),
        {
            onError: () => {
                setError('Felaktig e-postadress eller lösenord')
                setPassword('')
            },
            onSuccess: (val) => {
                setError('')
                dispatch(loginUser(val.data as AuthTokens))
            },
        }
    )

    return (
        <SmallContainer
            title='Logga in'
            header={<Link to='/login'>{'<< Tillbaka'}</Link>}
            footer={
                <>
                    <div className='pt-6'>
                        <span className='pr-2'>Har du inte ett konto?</span>
                        <Link to='/register' className='text-center text-secondary underline'>
                            Skapa ett här
                        </Link>
                    </div>
                </>
            }
        >
            <form
                className='flex flex-col items-center space-y-4'
                onSubmit={(e) => {
                    e.preventDefault()
                    loginMutation.mutate()
                }}
            >
                <div className='w-full'>
                    <TextField
                        onChange={(val) => {
                            setEmail(val)
                            setError('')
                        }}
                        value={email}
                        name='email'
                        placeholder='E-postadress'
                        data-testid='emailInput'
                        fullWidth={true}
                    />
                </div>
                <div className='w-full'>
                    <TextField
                        onChange={(val) => {
                            setPassword(val)
                            setError('')
                        }}
                        value={password}
                        name='password'
                        placeholder='Lösenord'
                        type='password'
                        data-testid='passwordInput'
                        fullWidth={true}
                    />
                    <Link className='block' to='/glomtlosenord'>
                        Har du glömt lösenordet?
                    </Link>
                </div>

                <Button label='Logga in' type='submit' data-testid='formSubmitButton' />
                <CustomGoogleLogin />
                <span className='text-red-400'>{error}</span>
            </form>
        </SmallContainer>
    )
}
export default SignInWithEmail
