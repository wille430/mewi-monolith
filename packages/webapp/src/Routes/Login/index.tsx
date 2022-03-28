import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import { Button, Container, TextField } from '@mewi/ui'
import { useDispatch } from 'react-redux'
import { loadPage, loginUser } from 'store/auth/creators'
import { useAppSelector } from 'hooks/hooks'
import { useEffect, useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState<string | undefined>('')
    const [password, setPassword] = useState<string | undefined>('')

    const dispatch = useDispatch()
    const errors = useAppSelector((state) => state.auth.errors)

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(loginUser({ email: email || '', password: password || '' }))
    }

    useEffect(() => {
        dispatch(loadPage())
    }, [])

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Container className='mx-auto max-w-lg'>
                    <Container.Header>
                        <h3 className='pb-6 pt-4 text-center'>Logga in</h3>
                    </Container.Header>
                    <Container.Content>
                        <form className='flex flex-col items-center space-y-4'>
                            <div className='w-full'>
                                <TextField
                                    onChange={setEmail}
                                    name='email'
                                    placeholder='E-postadress'
                                    data-testid='emailInput'
                                    fullWidth={true}
                                />
                                <span className='text-red-400'>{errors.email}</span>
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
                                <Link className='block' to='/glomtlosenord'>Har du glömt lösenordet?</Link>
                                <span className='text-red-400'>{errors.password}</span>
                            </div>

                            <Button
                                label='Logga in'
                                onClick={onFormSubmit}
                                data-testid='formSubmitButton'
                            />
                            <span className='text-red-400'>{errors.all}</span>
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
