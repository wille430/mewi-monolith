import { Button, TextField } from '@wille430/ui'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useAppDispatch } from '@/hooks'
import { signup } from '@/store/user'
import { handleSignUpError } from './handleSignUpError'
import { SignUpDto } from './SignUpDto'
import { ON_AUTH_SUCCESS_GOTO } from '@/constants/paths'

export const SignUpForm = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const formik = useFormik<SignUpDto>({
        initialValues: {
            email: '',
            password: '',
            passwordConfirm: '',
            'policy-agreement': false,
        },
        onSubmit: () => {
            dispatch(signup(formik.values))
                .then((res) => {
                    if (res.meta.requestStatus === 'fulfilled') {
                        router.push(ON_AUTH_SUCCESS_GOTO)
                    } else {
                        throw res.payload
                    }
                })
                .catch((err: any) => formik.setErrors(handleSignUpError(err)))
                .finally(() => {
                    formik.setSubmitting(false)
                })
        },
    })

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
                <span className='text-red-400'>{formik.errors.email}</span>
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
                <span className='text-red-400'>{formik.errors.password}</span>
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
                <span className='text-red-400'>{formik.errors.passwordConfirm}</span>
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
