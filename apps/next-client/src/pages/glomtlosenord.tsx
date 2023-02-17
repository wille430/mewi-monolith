import type { ReactElement } from 'react'
import { useState } from 'react'
import Head from 'next/head'
import { Formik } from 'formik'
import Link from 'next/link'
import { client } from '@/client'
import { Layout } from '@/components/Layout/Layout'
import { useUser } from '@/hooks/useUser'
import { TextField } from '@/components/TextField/TextField'
import { Button } from '@/components/Button/Button'

const ForgottenPassword = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    const [success, setSuccess] = useState(false)

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
                    <Formik
                        initialValues={{ email: '' }}
                        onSubmit={({ email }, actions) => {
                            client
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
                        {({ handleChange, values, isSubmitting, errors, handleSubmit }) => {
                            if (success)
                                return (
                                    <>
                                        <h3 className='mb-6 text-center text-green-400'>
                                            Återställningen lyckades!
                                        </h3>
                                        <p className='px-2 text-center'>
                                            Vi har skickat ett mejl till {values.email}. Var vänlig
                                            följ anvisningarna för att återställa lösenordet.
                                        </p>
                                    </>
                                )

                            return (
                                <>
                                    <>
                                        <div>
                                            <Link href='/loggain'>
                                                <span>{'<<'} Logga in istället</span>
                                            </Link>
                                        </div>
                                        <div className='mb-8 pt-12'>
                                            <h3 className='text-center text-primary'>
                                                Glömt lösenord
                                            </h3>
                                            <h4 className='text-center text-sm font-extralight text-gray-600'>
                                                Har du glömt ditt lösenord? Gör en
                                                lösenordsåterställning här:
                                            </h4>
                                        </div>
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
                                                <span className='text-red-400'>
                                                    {(errors as any).email}
                                                </span>
                                            </div>

                                            <Button
                                                label='Byt lösenord'
                                                size='lg'
                                                type='submit'
                                                data-testid='formSubmitButton'
                                                disabled={isSubmitting}
                                            />
                                        </form>
                                    </>
                                </>
                            )
                        }}
                    </Formik>
                </section>
            </main>
        </>
    )
}

ForgottenPassword.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default ForgottenPassword
