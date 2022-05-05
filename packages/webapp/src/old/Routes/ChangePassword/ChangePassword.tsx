import { Button, Container } from '@mewi/ui'
import Layout from 'components/Layout'
import { FormEvent, useEffect, useState } from 'react'
import FormTextField from 'components/FormTextField/FormTextField'
import { pushToSnackbar } from 'store/snackbar/creators'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-query'
import axios from 'axios'
import { useAppDispatch } from 'hooks/hooks'
import useQuery from 'hooks/useQuery'

const ForgottenPassword = () => {
    const initialState = {
        password: '',
        repassword: '',
        general: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState(initialState)
    const query = useQuery()
    const { token, email } = { token: query.get('token'), email: query.get('email') }
    const history = useHistory()
    const dispatch = useAppDispatch()

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
                history.push('/login')
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
            history.push('/')
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
