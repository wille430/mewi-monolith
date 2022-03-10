import { Button, Container, TextField } from '@mewi/ui'
import Layout from 'components/Layout'
import { useAppDispatch } from 'hooks/hooks'
import { FormEvent, useState } from 'react'

const ForgottenPassword = () => {
    const initialState = {
        password: '',
        repassword: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState(initialState)

    const dispatch = useAppDispatch()

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault()

        // TODO DISPATCH
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
                            <div className='w-full'>
                                <TextField
                                    onChange={(val) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            password: val || '',
                                        }))
                                    }
                                    value={formData.password}
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
                                    onChange={(val) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            repassword: val || '',
                                        }))
                                    }
                                    value={formData.repassword}
                                    name='repassword'
                                    placeholder='Bekräfta lösenord'
                                    type='password'
                                    data-testid='repasswordInput'
                                    fullWidth={true}
                                />
                                <span className='text-red-400'>{errors.repassword}</span>
                            </div>

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
