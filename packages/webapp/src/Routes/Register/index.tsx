import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import { Button, Container, TextField } from '@mewi/ui'
import { useDispatch } from 'react-redux'
import { createUser, loadPage } from 'store/auth/creators'
import { useAppSelector } from 'hooks/hooks'
import { useEffect, useState } from 'react'

const Register = () => {
    interface FormData {
        email?: string
        password?: string
        repassword?: string
    }

    const initFormData: FormData = {
        email: '',
        password: '',
        repassword: '',
    }

    const [formData, setFormData] = useState(initFormData)
    const { email, password, repassword } = formData

    const dispatch = useDispatch()
    const errors = useAppSelector((state) => state.auth.errors)

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(createUser([email || '', password || '', repassword || '']))
    }

    useEffect(() => {
        dispatch(loadPage())
    }, [])

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Container className='mx-auto max-w-lg'>
                    <Container.Header>
                        <h3 className='pb-6 pt-4 text-center'>Skapa ett konto</h3>
                    </Container.Header>
                    <Container.Content>
                        <form className='flex flex-col items-center space-y-4'>
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
                                <Link className='block' to='/glomtlosenord'>Har du glömt lösenordet?</Link>
                                <span className='text-red-400'>{errors.password}</span>
                            </div>
                            <div className='w-full'>
                                <TextField
                                    onChange={(value) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            repassword: value,
                                        }))
                                    }}
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
                                label='Registrera dig'
                                onClick={onFormSubmit}
                                data-testid='formSubmitButton'
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
