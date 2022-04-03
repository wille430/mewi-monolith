import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import { Button, Container, TextField } from '@mewi/ui'
import { useState } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'
import { useAppDispatch } from 'hooks/hooks'
import { loginUser } from 'store/auth/creators'
import { AuthTokens } from '@mewi/common/types'

const Login = () => {
    const [email, setEmail] = useState<string | undefined>('')
    const [password, setPassword] = useState<string | undefined>('')
    const dispatch = useAppDispatch()

    const [error, setError] = useState('')
    const mutation = useMutation(async () => await axios.post('/auth/login', { email, password }), {
        onError: () => setError('Felaktig e-postadress eller lösenord'),
        onSuccess: (val) => {
            setError('')
            dispatch(loginUser(val.data as AuthTokens))
        },
    })

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Container className='mx-auto max-w-lg'>
                    <Container.Header>
                        <h3 className='pb-6 pt-4 text-center'>Logga in</h3>
                    </Container.Header>
                    <Container.Content>
                        <form
                            className='flex flex-col items-center space-y-4'
                            onSubmit={(e) => {
                                e.preventDefault()
                                mutation.mutate()
                            }}
                        >
                            <div className='w-full'>
                                <TextField
                                    onChange={setEmail}
                                    name='email'
                                    placeholder='E-postadress'
                                    data-testid='emailInput'
                                    fullWidth={true}
                                />
                            </div>
                            <div className='w-full'>
                                <TextField
                                    onChange={setPassword}
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
                            <span className='text-red-400'>{error}</span>
                        </form>
                    </Container.Content>
                    <Container.Footer>
                        <div className='pt-6'>
                            <span className='pr-2'>Har du inte ett konto?</span>
                            <Link to='/register' className='text-center text-secondary underline'>
                                Skapa ett här
                            </Link>
                        </div>
                    </Container.Footer>
                </Container>
            </main>
            <aside className='side-col'></aside>
        </Layout>
    )
}

export default Login
