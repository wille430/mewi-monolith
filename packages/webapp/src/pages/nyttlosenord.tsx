import { Button, Container, TextField } from '@mewi/ui'
import { FormEvent, ReactElement, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { pushToSnackbar } from '@/store/snackbar/creators'
import { useAppDispatch } from '@/hooks'
import { Layout } from '@/components/Layout/Layout'

const ForgottenPassword = () => {
    const initialState = {
        password: '',
        repassword: '',
        general: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState(initialState)

    const router = useRouter()
    const dispatch = useAppDispatch()

    const { token, email } = { token: router.query.token, email: router.query.email }

    const mutation = useMutation(
        async () =>
            axios.put('/users/password', {
                token,
                password: formData.password,
                passwordConfirm: formData.repassword,
                email,
            }),
        {
            onSuccess: () => {
                router.push('/loggain')
                dispatch(pushToSnackbar({ title: 'Lösenordsändringen lyckades' }))
            },
            onError: () => {
                setErrors({
                    ...initialState,
                    general: 'Ett fel inträffade',
                })
            },
        }
    )

    useEffect(() => {
        if (!email || !token) {
            router.push('/')
        }
    }, [])

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (email && token && formData.password && formData.repassword) {
            setErrors(initialState)
            setFormData(initialState)
            mutation.mutate()
        }
    }

    return (
        <main>
            <Container
                className='mx-auto max-w-lg'
                style={{
                    marginTop: '15vh',
                }}
            >
                <Container.Header>
                    <h3 className='pb-6 pt-4 text-center'>Nytt lösenord</h3>
                </Container.Header>
                <Container.Content>
                    <form className='flex flex-col items-center space-y-4'>
                        <TextField
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                            value={formData.password}
                            name='password'
                            placeholder='Lösenord'
                            type='password'
                            data-testid='passwordInput'
                            fullWidth={true}
                        />
                        <span>{errors.password}</span>

                        <TextField
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    repassword: e.target.value,
                                }))
                            }
                            value={formData.repassword}
                            name='repassword'
                            placeholder='Bekräfta lösenord'
                            type='password'
                            data-testid='repasswordInput'
                            fullWidth={true}
                        />
                        <span>{errors.repassword}</span>

                        {errors.general && (
                            <span className='w-full text-red-400'>{errors.general}</span>
                        )}

                        <Button
                            label='Ändra lösenord'
                            onClick={onFormSubmit}
                            data-testid='formSubmitButton'
                        />
                    </form>
                </Container.Content>
                <Container.Footer>
                    <div className='pt-6'></div>
                </Container.Footer>
            </Container>
        </main>
    )
}

ForgottenPassword.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default ForgottenPassword
