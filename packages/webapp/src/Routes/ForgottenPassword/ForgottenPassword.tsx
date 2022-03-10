import { Button, Container, TextField } from '@mewi/ui'
import Layout from 'components/Layout'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ForgottenPassword = () => {
    const [email, setEmail] = useState<string | undefined>()
    const error = useState<string | undefined>()

    const onFormSubmit = () => {
        // TODO: disaptch api call
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
                                <span className='text-red-400'>{error}</span>
                            </div>

                            <Button
                                label='Registrera dig'
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
