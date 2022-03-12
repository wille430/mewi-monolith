import { Button, Container } from '@mewi/ui'
import Layout from 'components/Layout'
import { useAppDispatch } from 'hooks/hooks'
import { FormEvent, useState } from 'react'
import { changePassword, changePasswordErrorPayload } from 'store/auth/creators'
import useQuery from 'hooks/useQuery'
import FormTextField from 'components/FormTextField/FormTextField'
import { useHistory } from 'react-router-dom'
import { pushToSnackbar } from 'store/snackbar/creators'

const ForgottenPassword = () => {
    const initialState = {
        password: '',
        repassword: '',
        general: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState<changePasswordErrorPayload>(initialState)
    const query = useQuery()
    const history = useHistory()

    const dispatch = useAppDispatch()

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault()

        const { userId, token } = { userId: query.get('userId'), token: query.get('token') }

        console.log({ userId, token })

        if (userId && token && formData.password && formData.repassword) {
            dispatch(changePassword([userId, formData.password, formData.repassword, token])).then(
                (action) => {
                    if (action.meta.requestStatus === 'fulfilled') {
                        history.push('/login')
                        dispatch(pushToSnackbar({ title: 'Lösenordsändringen lyckades' }))
                    } else {
                        if (action.payload) {
                            setErrors(action.payload as changePasswordErrorPayload)
                        } else {
                            setErrors({
                                ...initialState,
                                general: 'Ett fel inträffade',
                            })
                        }
                    }
                }
            )
        }
    }

    return (
        <Layout>
            <main className='main'>
                <Container className='mx-auto max-w-lg'>
                    <Container.Header>
                        <h3 className='pb-6 pt-4 text-center'>Nytt lösenord</h3>
                    </Container.Header>
                    <Container.Content>
                        <form className='flex flex-col items-center space-y-4'>
                            <FormTextField
                                textFieldProps={{
                                    onChange: (val) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            password: val || '',
                                        })),
                                    value: formData.password,
                                    name: 'password',
                                    placeholder: 'Lösenord',
                                    type: 'password',
                                    'data-testid': 'passwordInput',
                                    fullWidth: true,
                                }}
                                errorMessage={errors.password}
                            />
                            <FormTextField
                                textFieldProps={{
                                    onChange: (val) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            repassword: val || '',
                                        })),
                                    value: formData.repassword,
                                    name: 'repassword',
                                    placeholder: 'Bekräfta lösenord',
                                    type: 'password',
                                    'data-testid': 'repasswordInput',
                                    fullWidth: true,
                                }}
                                errorMessage={errors.repassword}
                            />

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
        </Layout>
    )
}

export default ForgottenPassword
