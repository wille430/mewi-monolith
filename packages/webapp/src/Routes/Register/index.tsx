import Form from 'common/components/Form'
import FormInput from 'common/components/FormInput'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'common/components/Layout'
import { APIResponseError, AuthErrorCodes } from '@mewi/types'
import { SnackbarContext } from 'common/context/SnackbarContext'
import _ from 'lodash'
import { UserContext } from 'common/context/UserContext'

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
        switch (err.error.type) {
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
            <main className='w-full flex justify-center'>
                <Form
                    onFormSubmit={onFormSubmit}
                    title='Skapa konto'
                    buttonLabel='Registrera dig'
                    footer={[
                        <Link to='/login' className='text-sm inline-block py-2'>
                            Jag har redan ett konto
                        </Link>,
                    ]}
                >
                    <FormInput
                        onChange={(e: { currentTarget: HTMLInputElement }) => {
                            setFormData({
                                ...formData,
                                email: e.currentTarget?.value,
                            })
                        }}
                        errorMessage={errors.email}
                        name='email'
                        label='E-postadress'
                        data-testid='emailInput'
                    />
                    <FormInput
                        onChange={(e: { currentTarget: HTMLInputElement }) => {
                            setFormData({
                                ...formData,
                                password: e.currentTarget?.value,
                            })
                        }}
                        errorMessage={errors.password}
                        name='password'
                        label='Lösenord'
                        type='password'
                        data-testid='passwordInput'
                    />

                    <FormInput
                        onChange={(e: { currentTarget: HTMLInputElement }) => {
                            setFormData({
                                ...formData,
                                repassword: e.currentTarget?.value,
                            })
                        }}
                        errorMessage={errors.repassword}
                        name='repassword'
                        label='Bekräfta lösenord'
                        type='password'
                        data-testid='repasswordInput'
                    />
                </Form>
            </main>
            <aside className='side-col'></aside>
        </Layout>
    )
}

export default Register
