import { Button, Container, TextField } from '@wille430/ui'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/hooks'
import { signup } from '@/store/user'

export const SignUpForm = () => {
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
    const [errors, setErrors] = useState(initErrors)

    const dispatch = useAppDispatch()
    const router = useRouter()

    const createAccount = () =>
        dispatch(signup(formData))
            .then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    router.push('/minasidor')
                } else {
                    throw res.payload
                }
            })
            .catch((err: any) => {
                const message = err.message
                setErrors(initErrors)

                const newErrors: Partial<typeof errors> = {}

                for (const validationError of message) {
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
                                    newErrors.password =
                                        'Lösenordet måste minsta vara 8 tecken långt'
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
                            message.find((x) => x.property === 'password')?.constraints || []
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
            })

    return (
        <Container className='mx-auto max-w-lg'>
            <Container.Header>
                <h3 className='pb-6 pt-4 text-center'>Skapa ett konto</h3>
            </Container.Header>
            <Container.Content>
                <form
                    className='flex flex-col items-center space-y-4'
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className='w-full'>
                        <TextField
                            onChange={(e) => {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    email: e.target.value,
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
                            onChange={(e) => {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    password: e.target.value,
                                }))
                            }}
                            value={formData.password}
                            name='password'
                            placeholder='Lösenord'
                            type='password'
                            data-testid='passwordInput'
                            fullWidth={true}
                        />
                        <a className='block' href='/glomtlosenord'>
                            Har du glömt lösenordet?
                        </a>
                        <span className='text-red-400'>{errors.password}</span>
                    </div>
                    <div className='w-full'>
                        <TextField
                            onChange={(e) => {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    passwordConfirm: e.target.value,
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
                        onClick={() => createAccount()}
                    />
                    <span className='text-red-400'>{errors.all}</span>
                </form>
            </Container.Content>
            <Container.Footer>
                <div className='pt-6'>
                    <a href='/loggain' className='text-center'>
                        Har du redan ett konto?
                    </a>
                </div>
            </Container.Footer>
        </Container>
    )
}
