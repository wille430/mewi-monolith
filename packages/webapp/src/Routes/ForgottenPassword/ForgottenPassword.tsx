import { Button, Container, TextField } from '@mewi/ui'
import Layout from 'components/Layout'
import { useAppDispatch } from 'hooks/hooks'
import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { forgottenPassword } from 'store/user/creator'

const ForgottenPassword = () => {
    const [email, setEmail] = useState<string | undefined>()
    const [errorMessage, setErrorMessage] = useState<string | undefined>()
    const [success, setSuccess] = useState(false)

    const dispatch = useAppDispatch()

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault()
        // TODO: disaptch api call
        setErrorMessage(undefined)
        setSuccess(false)
        dispatch(forgottenPassword()).then((action) => {
            if (action.meta.requestStatus === 'fulfilled') {
                setSuccess(true)
                setEmail(undefined)
            } else {
                if (typeof action.payload === 'string') setErrorMessage(action.payload)
            }
        })
    }

    return (
        <Layout>
            <main className='main'>
                <Container className='mx-auto max-w-lg'>
                    <Container.Header>
                        <h3 className='pb-6 pt-4 text-center'>Ändra lösenord</h3>
                    </Container.Header>
                    <Container.Content>
                        <form className='flex flex-col items-center space-y-4'>
                            <div className='w-full'>
                                <TextField
                                    onChange={(value) => setEmail(value)}
                                    value={email}
                                    name='email'
                                    placeholder='E-postadress'
                                    data-testid='emailInput'
                                    fullWidth={true}
                                />
                                <span className='text-red-400'>{errorMessage}</span>
                                <span className='text-green-400'>
                                    {success &&
                                        `Ett meddelande till ${email} har skickats med en återställningslänk`}
                                </span>
                            </div>

                            <Button
                                label='Byt lösenord'
                                onClick={onFormSubmit}
                                data-testid='formSubmitButton'
                            />
                        </form>
                    </Container.Content>
                    <Container.Footer>
                        <div className='pt-6'>
                            <Link to='/login' className='text-center underline'>
                                Logga in istället
                            </Link>
                        </div>
                    </Container.Footer>
                </Container>
            </main>
        </Layout>
    )
}

export default ForgottenPassword
