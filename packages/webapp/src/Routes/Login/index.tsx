import Form from 'common/components/Form'
import FormInput from 'common/components/FormInput'
import * as React from 'react'
import { Link } from 'react-router-dom'
import Layout from 'common/components/Layout'
import { AuthErrorCodes } from '@mewi/types'
import _ from 'lodash'
import { UserContext } from 'common/context/UserContext'
import { useContext } from 'react'

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

        try {
            userDispatch({ type: 'login', userCredentials: { email, password } })
        } catch (e: any) {
            setErrors(initErrors)
            console.log('ERROR WHEN LOGGING IN ', e)
            switch (e.error?.type) {
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
    }

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <section className='w-full flex justify-center'>
                    <Form
                        onFormSubmit={onFormSubmit}
                        title='Logga in'
                        buttonLabel='Logga in'
                        footer={[
                            <Link to='/register' className='text-sm inline-block py-2'>
                                Skapa ett konto
                            </Link>,
                        ]}
                    >
                        <FormInput
                            onChange={(e: { currentTarget: HTMLInputElement }) =>
                                setEmail(e.currentTarget?.value)
                            }
                            errorMessage={errors.email}
                            name='email'
                            label='E-postadress'
                            data-testid='emailInput'
                        />
                        <FormInput
                            onChange={(e: { currentTarget: HTMLInputElement }) =>
                                setPassword(e.currentTarget?.value)
                            }
                            errorMessage={errors.password}
                            name='password'
                            label='Lösenord'
                            type='password'
                            data-testid='passwordInput'
                        />
                    </Form>
                </section>
            </main>
            <aside className='side-col'></aside>
        </Layout>
    )
}

export default Login
