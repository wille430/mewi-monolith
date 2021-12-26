import Form from 'common/components/Form'
import FormInput from 'common/components/FormInput'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'common/components/Layout'
import { APIResponseError, AuthErrorCodes } from '@mewi/types'
import { SnackbarContext } from 'common/context/SnackbarContext'
import _ from 'lodash'
import { UserContext } from 'common/context/UserContext'
import { Button, Container, TextField } from '@mewi/ui'

const Register = () => {
    const { setSnackbar } = useContext(SnackbarContext)
    const { userDispatch } = useContext(UserContext)

    // const [username, setUsername] = React.useState('')
    const initFormData = {
        email: '',
        password: '',
        repassword: '',
        all: '',
    }
    const [formData, setFormData] = React.useState(initFormData)
    const { email, password, repassword } = formData

    const initErrors = {
        ...initFormData,
        all: '',
    }
    const [errors, setErrors] = React.useState(initErrors)

    const handleError = (err: APIResponseError) => {
        switch (err?.error?.type) {
            case AuthErrorCodes.INVALID_EMAIL:
                setErrors({
                    ...initErrors,
                    email: 'Felaktig epostaddress',
                })
                break
            case AuthErrorCodes.USER_ALREADY_EXISTS:
                setErrors({
                    ...initErrors,
                    email: 'Epostaddressen är upptagen',
                })
                break
            case AuthErrorCodes.PASSWORD_NOT_STRONG_ENOUGH:
                setErrors({
                    ...initErrors,
                    password:
                        'Lösenordet är för svagt. Använd minst 8 bokstäver, special tecken, stor bokstav och siffror',
                })
                break
            case AuthErrorCodes.PASSWORD_TOO_LONG:
                setErrors({
                    ...initErrors,
                    password:
                        'Lösenordet är för långt. Använd minst 8 bokstäver och max 30 bokstäver',
                })
                break
            case AuthErrorCodes.PASSWORD_NOT_MATCHING:
                setErrors({
                    ...initErrors,
                    repassword: 'Lösenorden måste matcha',
                })
                break
            default:
                setErrors({
                    ...initErrors,
                    all: 'Ett fel inträffade. Försök igen',
                })
                break
        }
    }

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        userDispatch({
            type: 'signup',
            signUpCredentials: _.omit(formData, 'all'),
            callback: (authTokens, err) => {
                setErrors(initErrors)
                console.log('REGISTER ERROR:', err)
                if (!err) {
                    setSnackbar({
                        title: 'Ditt konto skapades!',
                    })
                } else {
                    handleError(err)
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
                        <h3 className='text-center pb-6 pt-4'>Skapa ett konto</h3>
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
                                    onChange={(value) => {
                                        setFormData({
                                            ...formData,
                                            email: value,
                                        })
                                    }}
                                    name='email'
                                    placeholder='E-postadress'
                                    data-testid='emailInput'
                                    fullWidth={true}
                                />
                                <span className='text-red-400'>{errors.email}</span>
                            </div>
                            <div className='w-full'>
                                <TextField
                                    onChange={(value) => {
                                        setFormData({
                                            ...formData,
                                            password: value,
                                        })
                                    }}
                                    name='password'
                                    placeholder='Lösenord'
                                    type='password'
                                    data-testid='passwordInput'
                                    fullWidth={true}
                                />
                                <span className='text-red-400'>{errors.password}</span>
                            </div>
                            <div className='w-full'>
                                <TextField
                                    onChange={(value) => {
                                        setFormData({
                                            ...formData,
                                            repassword: value,
                                        })
                                    }}
                                    name='repassword'
                                    placeholder='Bekräfta lösenord'
                                    type='password'
                                    data-testid='repasswordInput'
                                    fullWidth={true}
                                />
                                <span className='text-red-400'>{errors.repassword}</span>
                            </div>
                            <Button label='Registrera dig' type='submit' />
                            <span className='text-red-400'>{errors.all}</span>
                        </form>
                    </Container.Content>
                    <Container.Footer>
                        <div className='pt-6'>
                            <Link to='/login' className='text-center'>
                                Har du redan ett konto?
                            </Link>
                        </div>
                    </Container.Footer>
                </Container>
            </main>
            <aside className='side-col'></aside>
        </Layout>
    )
}

export default Register
