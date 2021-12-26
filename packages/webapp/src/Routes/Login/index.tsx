import * as React from 'react'
import { Link } from 'react-router-dom'
import Layout from 'common/components/Layout'
import { AuthErrorCodes } from '@mewi/types'
import _ from 'lodash'
import { UserContext } from 'common/context/UserContext'
import { useContext } from 'react'
import { Button, Container, TextField } from '@mewi/ui'

const Login = () => {
    const { userDispatch } = useContext(UserContext)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const initErrors = {
        email: '',
        password: '',
        all: '',
    }
    const [errors, setErrors] = React.useState(initErrors)

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        userDispatch({
            type: 'login',
            userCredentials: { email, password },
            callback: (authTokens, err) => {
                if (err) {
                    setErrors(initErrors)
                    switch (err?.error?.type) {
                        case AuthErrorCodes.INVALID_EMAIL:
                        case AuthErrorCodes.INVALID_PASSWORD:
                        case AuthErrorCodes.MISSING_USER:
                            setErrors({
                                email: 'Felaktig epostaddress eller lösenord',
                                password: 'Felaktig epostaddress eller lösenord',
                                all: '',
                            })
                            break
                        default:
                            setErrors({
                                ...initErrors,
                                all: 'Ett fel inträffade. Försök igen.',
                            })
                            break
                    }
                }
            },
        })
    }

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Container className='max-w-lg mx-auto'>
                    <Container.Header>
                        <h3 className='text-center pb-6 pt-4'>Logga in</h3>
                    </Container.Header>
                    {/* <Form
                        onFormSubmit={onFormSubmit}
                        title='Logga in'
                        buttonLabel='Logga in'
                        footer={[
                            <Link to='/register' className='text-sm inline-block py-2'>
                                Skapa ett konto
                            </Link>,
                        ]}
                    > */}
                    <Container.Content>
                        <form
                            onSubmit={onFormSubmit}
                            className='flex flex-col items-center space-y-4'
                        >
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

                            <Button label='Logga in' type='submit' />
                            <span className='text-red-400'>{errors.all}</span>
                        </form>
                    </Container.Content>
                    <Container.Footer>
                        <div className='pt-6'>
                            <Link to='/register' className='text-center'>
                                Har du inte ett konto? Skapa ett här
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
