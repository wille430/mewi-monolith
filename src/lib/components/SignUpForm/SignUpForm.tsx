import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import Link from 'next/link'
import { handleSignUpError } from './handleSignUpError'
import { TextField } from '../TextField/TextField'
import { Button } from '../Button/Button'
import { ON_AUTH_SUCCESS_GOTO } from '@/lib/constants/paths'
import { signup } from '@/lib/client'
import type SignUpDto from '@/lib/modules/auth/dto/sign-up.dto'
import { signUpSchema } from '@/lib/client/auth/schemas/sign-up.schema'
import { ValidationExceptionRes } from '@/lib/exceptions/validation.exception'

export const SignUpForm = () => {
    const router = useRouter()

    const formik = useFormik<SignUpDto>({
        initialValues: {
            email: '',
            password: '',
            passwordConfirm: '',
        },
        onSubmit: () => {
            signup(formik.values)
                .then(() => {
                    router.push(ON_AUTH_SUCCESS_GOTO)
                })
                .catch((err: ValidationExceptionRes) => {
                    formik.setErrors(handleSignUpError(err))
                })
                .finally(() => {
                    formik.setSubmitting(false)
                })
        },
        validationSchema: signUpSchema,
    })

    const errors = formik.errors as any

    return (
        <form className='form' onSubmit={formik.handleSubmit}>
            <div>
                <TextField
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    name='email'
                    placeholder='E-postadress'
                    data-testid='emailInput'
                    fullWidth={true}
                    disabled={formik.isSubmitting}
                />
                <span className='text-red-400'>{errors.email}</span>
            </div>
            <div>
                <TextField
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    disabled={formik.isSubmitting}
                    name='password'
                    placeholder='Lösenord'
                    type='password'
                    data-testid='passwordInput'
                    fullWidth={true}
                />
                <span className='text-red-400'>{errors.password}</span>
            </div>
            <div>
                <TextField
                    onChange={formik.handleChange}
                    value={formik.values.passwordConfirm}
                    disabled={formik.isSubmitting}
                    name='passwordConfirm'
                    placeholder='Bekräfta lösenord'
                    type='password'
                    data-testid='repasswordInput'
                    fullWidth={true}
                />
                <span className='text-red-400'>{errors.passwordConfirm}</span>
            </div>
            {/* 
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        <Checkbox
                            className='accent-primary scale-125'
                            onChange={formik.handleChange}
                            checked={formik.values['policy-agreement']}
                            name='policy-agreement'
                            disabled={formik.isSubmitting}
                        />
                        <span>
                            Jag godkänner <a className='text-primary'>Villkor</a> och{' '}
                            <a className='text-primary'>Integritetspolicy</a>
                        </span>
                        <span className='text-red-400'>{formik.errors['policy-agreement']}</span>
                    </div>
                </div> */}

            <div className='btn-group pt-8'>
                <Button
                    label='Registrera dig'
                    size='lg'
                    data-testid='formSubmitButton'
                    type='submit'
                    className='flex-grow md:flex-none'
                />
                <Link href='/loggain'>
                    <Button
                        label='Logga in'
                        variant='outlined'
                        size='lg'
                        className='flex-grow md:flex-none'
                    />
                </Link>
            </div>
        </form>
    )
}
