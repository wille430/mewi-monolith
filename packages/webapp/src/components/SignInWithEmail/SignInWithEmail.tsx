import { Button, TextField } from '@mewi/ui'
import { useState } from 'react'
import SmallContainer from '@/components/SmallContainer/SmallContainer'
import { useMutation } from 'react-query'
import { useAppDispatch } from '@/hooks'
import { setLoggedInStatus } from '@/store/user'
import { useRouter } from 'next/router'

export function SignInWithEmail() {
    const [email, setEmail] = useState<string | undefined>('')
    const [password, setPassword] = useState<string | undefined>('')
    const [error, setError] = useState('')

    const dispatch = useAppDispatch()
    const Router = useRouter()

    const mutation = useMutation(
        () =>
            fetch('/api/login', {
                method: 'post',
                body: JSON.stringify({ email, password }),
            }),
        {
            onError: () => {
                setError('Felaktig e-postadress eller lösenord')
                setPassword('')
            },
            onSuccess: () => {
                dispatch(setLoggedInStatus(true))
                Router.push('/minasidor')
            },
        }
    )

    return (
        <SmallContainer
            title='Logga in'
            // header={<a href='/login'>{'<< Tillbaka'}</a>}
            footer={
                <>
                    <div>
                        <span className='pr-2'>Har du inte ett konto?</span>
                        <a href='/nyttkonto' className='text-center text-secondary underline'>
                            Skapa ett här
                        </a>
                    </div>
                </>
            }
        >
            <form
                className='flex flex-col items-center space-y-4'
                onSubmit={(e) => {
                    e.preventDefault()
                    mutation.mutate()
                }}
            >
                <div className='w-full'>
                    <TextField
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }}
                        value={email}
                        name='email'
                        placeholder='E-postadress'
                        data-testid='emailInput'
                        fullWidth={true}
                        disabled={mutation.isLoading}
                    />
                </div>
                <div className='w-full'>
                    <TextField
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                        }}
                        value={password}
                        name='password'
                        placeholder='Lösenord'
                        type='password'
                        data-testid='passwordInput'
                        fullWidth={true}
                        disabled={mutation.isLoading}
                    />
                    <a className='block' href='/glomtlosenord'>
                        Har du glömt lösenordet?
                    </a>
                </div>

                <Button
                    label='Logga in'
                    type='submit'
                    data-testid='formSubmitButton'
                    disabled={mutation.isLoading}
                />
                <span className='text-red-400'>{error}</span>
            </form>
        </SmallContainer>
    )
}
export default SignInWithEmail
