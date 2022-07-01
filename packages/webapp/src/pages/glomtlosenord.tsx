import { Button, TextField } from '@wille430/ui'
import { ReactElement, useState } from 'react'
import Head from 'next/head'
import { Formik } from 'formik'
import Link from 'next/link'
import { instance } from '@/lib/axios'
import { Layout } from '@/components/Layout/Layout'
import { useUser } from '@/hooks/useUser'

const ForgottenPassword = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    const [success, setSuccess] = useState(false)
    // `Ett mejl har skickats till ${email} med en lösenordsåterställningslänk`

    return (
        <>
            <Head>
                <title>Glömt lösenord | Mewi.se</title>
            </Head>

            <main className='p-4'>
                <section
                    className='section max-w-screen-sm py-16 pt-6'
                    style={{ marginTop: '15vh' }}
                >
                    {success ? (
                        <>
                            <h3 className='mb-6 text-center text-green-400'>
                                Återställningen lyckades!
                            </h3>
                            <p className='text-center'>
                                Vi har skickar ett mejl till dig. Var vänlig följ anvisningarna för
                                att återställa lösenordet.
                            </p>
                        </>
                    ) : (
                        <>
                            <div>
                                <Link href='/loggain'>
                                    <a>{'<<'} Logga in istället</a>
                                </Link>
                            </div>
                            <div className='mb-8 pt-12'>
                                <h3 className='text-center text-primary'>Glömt lösenord</h3>
                                <h4 className='text-center text-sm font-extralight text-gray-600'>
                                    Har du glömt ditt lösenord? Gör en lösenordsåterställning här:
                                </h4>
                            </div>
                            <Formik
                                initialValues={{ email: '' }}
                                onSubmit={({ email }, actions) => {
                                    instance
                                        .put('/users/password', { email })
                                        .then(() => {
                                            setSuccess(true)
                                        })
                                        .catch(() => {
                                            actions.setFieldError('email', 'Ett fel inträffade')
                                        })
                                }}
                                validate={(values) => {
                                    if (!values.email) {
                                        return {
                                            email: 'Fältet kan inte vara tomt',
                                        }
                                    }
                                }}
                            >
                                {({ handleChange, values, isSubmitting, errors, handleSubmit }) => (
                                    <form className='form' onSubmit={handleSubmit}>
                                        <div className='w-full'>
                                            <TextField
                                                onChange={handleChange}
                                                value={values.email}
                                                name='email'
                                                placeholder='E-postadress'
                                                data-testid='emailInput'
                                                fullWidth={true}
                                            />
                                            <span className='text-red-400'>{errors.email}</span>
                                        </div>

                                        <div className='btn-group'>
                                            <Button
                                                label='Byt lösenord'
                                                size='lg'
                                                type='submit'
                                                data-testid='formSubmitButton'
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </>
                    )}
                </section>
            </main>
        </>
    )
}

ForgottenPassword.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default ForgottenPassword
