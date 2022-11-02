import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import Link from 'next/link'
import type { EmailSignInDto } from './EmailSignInDto'
import { handleSignInError } from './handleSignInError'
import { TextField } from '../TextField/TextField'
import { Button } from '../Button/Button'
import { useAppDispatch } from '@/lib/hooks'
import { login } from '@/lib/store/user'
import { ON_AUTH_SUCCESS_GOTO } from '@/lib/constants/paths'

const initialValues = { email: '', password: '' }

export const EmailSignInForm = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const {
        handleSubmit,
        setFieldValue,
        setErrors,
        values,
        handleChange,
        errors,
        isSubmitting,
        setSubmitting,
    } = useFormik<EmailSignInDto>({
        initialValues,
        onSubmit: () => mutation.mutate(),
    })

    const mutation: any = useMutation(
        () =>
            dispatch(login(values)).then((res: any) => {
                if (res.meta.requestStatus === 'rejected') {
                    throw res.payload
                }
            }),
        {
            onMutate: () => {
                router.prefetch(ON_AUTH_SUCCESS_GOTO)
                setSubmitting(true)
            },
            onSuccess: () => {
                window.location.href = ON_AUTH_SUCCESS_GOTO
            },
            onError: () => {
                setFieldValue('password', '').then(() => {
                    const formErr = handleSignInError()
                    setErrors(formErr)
                })
            },
            onSettled: () => {
                setSubmitting(false)
            },
        }
    )

    return (
        <form className='form' onSubmit={handleSubmit}>
            <div className='w-full'>
                <TextField
                    onChange={handleChange}
                    value={values.email}
                    id='email'
                    name='email'
                    placeholder='E-postadress'
                    data-testid='emailInput'
                    fullWidth={true}
                    disabled={isSubmitting}
                />
            </div>
            <div className='w-full'>
                <TextField
                    onChange={handleChange}
                    value={values.password}
                    id='password'
                    name='password'
                    placeholder='Lösenord'
                    type='password'
                    data-testid='passwordInput'
                    fullWidth={true}
                    disabled={isSubmitting}
                />
                <Link className='block text-sm hover:underline' href='/glomtlosenord'>
                    Har du glömt lösenordet?
                </Link>
            </div>

            {errors.password && <span className='text-red-400'>{errors.password}</span>}
            <div className='btn-group'>
                <Button
                    label='Logga in'
                    type='submit'
                    data-testid='formSubmitButton'
                    size='lg'
                    disabled={isSubmitting}
                    className='flex-grow md:flex-none'
                />
                <Link href='/nyttkonto'>
                    <Button
                        label='Nytt konto'
                        variant='outlined'
                        size='lg'
                        className='flex-grow md:flex-none'
                    />
                </Link>
            </div>
        </form>
    )
}
