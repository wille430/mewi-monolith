import * as React from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import { Button, Container, TextField } from '@mewi/ui'
import { useDispatch } from 'react-redux'
import { loginUser } from 'store/auth/creators'
import { useAppSelector } from 'hooks/hooks'

const Login = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const dispatch = useDispatch()
    const errors = useAppSelector(state => state.auth.errors)

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(loginUser({ email, password }))
    }

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Container className='max-w-lg mx-auto'>
                    <Container.Header>
                        <h3 className='text-center pb-6 pt-4'>Logga in</h3>
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
                                <span className='text-red-400'>{errors.password}</span>
                            </div>

                            <Button label='Logga in' onClick={onFormSubmit} data-testid='formSubmitButton'/>
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
