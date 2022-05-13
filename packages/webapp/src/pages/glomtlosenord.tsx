import { Layout } from '@/components/Layout/Layout'
import { Button, Container, TextField } from '@mewi/ui'
import axios from 'axios'
import Link from 'next/link'
import { FormEvent, ReactElement, useState } from 'react'
import { useMutation } from 'react-query'

const ForgottenPassword = () => {
    const [email, setEmail] = useState<string | undefined>()
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const mutation = useMutation(async () => axios.put('/users/password', { email }), {
        onSuccess: () => {
            setSuccessMessage(
                `Ett mejl har skickats till ${email} med en lösenordsåterställningslänk`
            )
            setEmail('')
        },
        onError: () => setErrorMessage('Ett fel inträffade'),
    })

    const onFormSubmit = async (e: FormEvent) => {
        e.preventDefault()

        setErrorMessage('')
        setSuccessMessage('')

        if (!email) {
            setErrorMessage('Fältet kan inte vara tomt')
            return
        }

        mutation.mutate()
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
                    <h3 className='pb-6 pt-4 text-center'>Glömt lösenord</h3>
                </Container.Header>
                <Container.Content>
                    <div className='flex flex-col items-center space-y-4'>
                        <div className='w-full'>
                            <TextField
                                onChange={(e) => {
                                    setSuccessMessage('')
                                    setEmail(e.target.value)
                                }}
                                value={email}
                                name='email'
                                placeholder='E-postadress'
                                data-testid='emailInput'
                                fullWidth={true}
                            />
                            <span className='text-red-400'>{errorMessage}</span>
                            <span className='text-green-400'>{successMessage}</span>
                        </div>

                        <Button
                            label='Byt lösenord'
                            onClick={onFormSubmit}
                            data-testid='formSubmitButton'
                            disabled={mutation.isLoading}
                        />
                    </div>
                </Container.Content>
                <Container.Footer>
                    <div className='pt-6'>
                        <Link href='/login' className='text-center underline'>
                            Logga in istället
                        </Link>
                    </div>
                </Container.Footer>
            </Container>
        </main>
    )
}

ForgottenPassword.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default ForgottenPassword
