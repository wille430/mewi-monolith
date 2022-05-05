import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import { Button, Container, TextField } from '@mewi/ui'
import { useState } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'
import { ApiErrorResponse } from 'types/types'
import { useAppDispatch } from 'hooks/hooks'
import { loginUser } from 'store/auth/creators'
import { AuthTokens } from '@wille430/common'

const Register = () => {
    interface FormData {
        email?: string
        password?: string
        passwordConfirm?: string
    }

    const initFormData: FormData = {
        email: '',
        password: '',
        passwordConfirm: '',
    }

    const initErrors = { ...initFormData, all: '' }

    const [formData, setFormData] = useState(initFormData)
    const { email, password, passwordConfirm } = formData
    const [errors, setErrors] = useState(initErrors)
    const dispatch = useAppDispatch()
    const mutation = useMutation(async () => await axios.post('/auth/signup', formData), {
        onSuccess: (res) => {
            dispatch(loginUser(res.data as AuthTokens))
        },
        onError: (err: ApiErrorResponse) => {
            setErrors(initErrors)
            const newErrors: Partial<typeof errors> = {}
            for (const validationError of err.message) {
                if (validationError.property === 'email') {
                    for (const constraint of Object.keys(validationError.constraints)) {
                        switch (constraint) {
                            case 'isEmail':
                                newErrors.email = 'E-postadressen är felaktig'
                                break
                            case 'isNotEmpty':
                                newErrors.email = 'Fältet kan inte vara tomt'
                                break
                            case 'UniqueEmail':
                                newErrors.email = 'E-postadressen är upptagen'
                        }
                    }
                } else if (validationError.property === 'password') {
                    for (const constraint of Object.keys(validationError.constraints)) {
                        switch (constraint) {
                            case 'matches':
                                newErrors.password = 'Lösenordet är för svagt'
                                break
                            case 'minLength':
                                newErrors.password = 'Lösenordet måste minsta vara 8 tecken långt'
                                break
                            case 'isNotEmpty':
                                newErrors.password = 'Fältet kan inte vara tomt'
                                break
                            case 'maxLength':
                                newErrors.password = 'Lösenordet kan max vara 20 tecken långt'
                        }
                    }
                } else if (
                    validationError.property === 'passwordConfirm' &&
                    Object.keys(
                        err.message.find((x) => x.property === 'password')?.constraints || []
                    ).length === 0
                ) {
                    for (const constraint of Object.keys(validationError.constraints)) {
                        switch (constraint) {
                            case 'Match':
                                newErrors.password = 'Lösenorden måste matcha'
                                newErrors.passwordConfirm = 'Lösenorden måste matcha'
                                break
                            case 'isNotEmpty':
                                newErrors.passwordConfirm = 'Fältet kan inte vara tomt'
                        }
                    }
                }
            }
            setErrors({ ...initErrors, ...newErrors })
        },
    })

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Container className='mx-auto max-w-lg'>
                    <Container.Header>
                        <h3 className='pb-6 pt-4 text-center'>Skapa ett konto</h3>
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
                                    onChange={(value) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            email: value,
                                        }))
                                    }}
                                    value={formData.email}
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
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            password: value,
                                        }))
                                    }}
                                    value={formData.password}
                                    name='password'
                                    placeholder='Lösenord'
                                    type='password'
                                    data-testid='passwordInput'
                                    fullWidth={true}
                                />
                                <Link className='block' to='/glomtlosenord'>
                                    Har du glömt lösenordet?
                                </Link>
                                <span className='text-red-400'>{errors.password}</span>
                            </div>
                            <div className='w-full'>
                                <TextField
                                    onChange={(value) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            passwordConfirm: value,
                                        }))
                                    }}
                                    value={formData.passwordConfirm}
                                    name='repassword'
                                    placeholder='Bekräfta lösenord'
                                    type='password'
                                    data-testid='repasswordInput'
                                    fullWidth={true}
                                />
                                <span className='text-red-400'>{errors.passwordConfirm}</span>
                            </div>
                            <Button
                                label='Registrera dig'
                                data-testid='formSubmitButton'
                                type='submit'
                            />
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
