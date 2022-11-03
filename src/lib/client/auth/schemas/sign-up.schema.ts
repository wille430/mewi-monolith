import type SignUpDto from '@/lib/modules/auth/dto/sign-up.dto'
import { object, ref, string } from 'yup'

export const EMPTY_FIELD_MSG = 'Fältet kan inte vara tomt'
export const INVALID_EMAIL_MSG = 'E-postadressen är inte giltig'

export const PASSWORD_STRENGTH_MSG =
    'Lösenordet måste innehålla små och stora bokstäver, minst ett specialtecken (., _, -, ? ...) och minst en siffra'
export const PASSWORD_TOO_SHORT_MSG = 'Lösenordet måste innehålla minst 8 karaktärer'
export const PASSWORD_TOO_LONG_MSG = 'Lösenordet måste innehålla max 32 karaktärer'

export const signUpSchema = object().shape<Record<keyof SignUpDto, any>>({
    email: string().required(EMPTY_FIELD_MSG).email(INVALID_EMAIL_MSG),
    password: string()
        .oneOf([ref('passwordConfirm'), null], 'Lösenorden måste')
        .min(8, PASSWORD_TOO_SHORT_MSG)
        .max(32, PASSWORD_TOO_LONG_MSG)
        .matches(
            new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
            PASSWORD_STRENGTH_MSG
        ),
    passwordConfirm: string().oneOf([ref('passwordConfirm')], 'Lösenorden måste'),
})
