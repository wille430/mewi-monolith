import type { FormEvent, ReactElement } from 'react'
import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import Head from 'next/head'
import { pushToSnackbar } from '@/lib/store/snackbar/creators'
import { useAppDispatch } from '@/lib/hooks'
import { Layout } from '@/lib/components/Layout/Layout'
import { useUser } from '@/lib/hooks/useUser'
import { PASSWORD_RESET_REDIRECT_TO } from '@/lib/constants/paths'
import { Container } from '@/lib/components/Container/Container'
import { TextField } from '@/lib/components/TextField/TextField'
import { Button } from '@/lib/components/Button/Button'
import { updatePasswordMutation } from '@/lib/client/users/mutations'

const ForgottenPassword = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

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

    useEffect(() => {
        if (!email || !token) {
            router.push('/')
        }
    }, [])

    const onFormSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (email && token && formData.password && formData.repassword) {
            setErrors(initialState)
            setFormData(initialState)
            await updatePasswordMutation({
                token: token as string,
                email: email as string,
                password: formData.password,
                passwordConfirm: formData.repassword,
            })
                .then(() => {
                    Router.push(PASSWORD_RESET_REDIRECT_TO)
                    dispatch(pushToSnackbar({ title: 'Lösenordsändringen lyckades' }))
                })
                .catch(() => {
                    setErrors({
                        ...initialState,
                        general: 'Ett fel inträffade',
                    })
                })
        }
    }

    return (
        <>
            <Head>
                <title>Nytt lösenord | Mewi.se</title>
            </Head>

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
        </>
    )
}

ForgottenPassword.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default ForgottenPassword
