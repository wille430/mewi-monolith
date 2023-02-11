import type {ChangePasswordWithToken} from '@/lib/modules/users/dto/change-password.dto'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import type {FormikHelpers, FormikErrors} from 'formik'
import {updatePasswordMutation} from '@/lib/client/users/mutations'
import {PASSWORD_RESET_REDIRECT_TO} from '@/lib/constants/paths'
import {useAppDispatch} from '@/lib/hooks'
import Router from 'next/router'
import {Button} from '../Button/Button'
import {handleError} from './handleError'
import {TextField} from '../TextField/TextField'

export const UpdatePasswordForm = (props: { initialValues: Partial<ChangePasswordWithToken> }) => {
    const dispatch = useAppDispatch()

    const initialValues: ChangePasswordWithToken = {
        ...(props.initialValues as ChangePasswordWithToken),
        password: '',
        passwordConfirm: '',
    }

    const handleSubmit = async (
        values: ChangePasswordWithToken,
        {setErrors}: FormikHelpers<ChangePasswordWithToken>
    ) => {
        try {
            await updatePasswordMutation({
                ...values,
                ...props.initialValues,
            })
            await Router.push(PASSWORD_RESET_REDIRECT_TO)
        } catch (error: any) {
            setErrors(handleError(error))
        }
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({errors}: { errors: FormikErrors<ChangePasswordWithToken> }) => (
                <Form className="flex flex-col items-center space-y-4">
                    <div className="flex flex-col space-y-8 w-96">
                        <Field
                            as={TextField}
                            name="password"
                            placeholder="Lösenord"
                            type="password"
                            data-testid="passwordInput"
                            className="w-full"
                        />
                        <ErrorMessage name="password"/>

                        <Field
                            as={TextField}
                            name="passwordConfirm"
                            placeholder="Bekräfta lösenord"
                            type="password"
                            data-testid="repasswordInput"
                            className="w-full"
                        />
                        <ErrorMessage name="passwordConfirm"/>
                    </div>

                    {(errors as any).all && (
                        <span className="w-full text-red-400">{(errors as any).all}</span>
                    )}
                    <ErrorMessage name="all"/>

                    <Button label="Ändra lösenord" data-testid="formSubmitButton"/>
                </Form>
            )}
        </Formik>
    )
}
