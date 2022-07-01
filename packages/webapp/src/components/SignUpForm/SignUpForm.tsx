import { Button, TextField } from '@wille430/ui'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useAppDispatch } from '@/hooks'
import { signup } from '@/store/user'

export const SignUpForm = () => {
    const handleError = (err: any) => {
        const message = err.message
        formik.setErrors({})

        const newErrors: typeof formik.errors = {}

        for (const validationError of message) {
            if (validationError.property === 'email') {
                for (const constraint of Object.keys(validationError.constraints)) {
                    switch (constraint) {
                        case 'isEmail':
                            newErrors.email = 'E-postadressen är felaktig'
                            break
                        case 'isNotEmpty':
                            newErrors.email = 'Fältet kan inte vara tomt'
                            break
                        case 'UniqueEmail':
                            newErrors.email = 'E-postadressen är upptagen'
                    }
                }
            } else if (validationError.property === 'password') {
                for (const constraint of Object.keys(validationError.constraints)) {
                    switch (constraint) {
                        case 'matches':
                            newErrors.password = 'Lösenordet är för svagt'
                            break
                        case 'minLength':
                            newErrors.password = 'Lösenordet måste minsta vara 8 tecken långt'
                            break
                        case 'isNotEmpty':
                            newErrors.password = 'Fältet kan inte vara tomt'
                            break
                        case 'maxLength':
                            newErrors.password = 'Lösenordet kan max vara 20 tecken långt'
                    }
                }
            } else if (
                validationError.property === 'passwordConfirm' &&
                Object.keys(message.find((x) => x.property === 'password')?.constraints || [])
                    .length === 0
            ) {
                for (const constraint of Object.keys(validationError.constraints)) {
                    switch (constraint) {
                        case 'Match':
                            newErrors.password = 'Lösenorden måste matcha'
                            newErrors.passwordConfirm = 'Lösenorden måste matcha'
                            break
                        case 'isNotEmpty':
                            newErrors.passwordConfirm = 'Fältet kan inte vara tomt'
                    }
                }
            }
        }

        formik.setErrors(newErrors)
    }

    const formik = useFormik({
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
                        router.push('/minasidor')
                    } else {
                        throw res.payload
                    }
                })
                .catch(handleError)
                .finally(() => {
                    formik.setSubmitting(false)
                })
        },
    })

    const dispatch = useAppDispatch()
    const router = useRouter()

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
                    name='repassword'
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
