import { ValidationExceptionRes } from '@/lib/exceptions/validation.exception'
import type SignUpDto from '@/lib/modules/auth/dto/sign-up.dto'
import { FormError } from '@/lib/types/forms'

export const handleSignUpError = (res: ValidationExceptionRes): FormError<SignUpDto> => {
    if (!res) {
        return { all: 'Ett fel inträffade' }
    }
    const { errors } = res
    const newErrors: { [key in keyof Partial<SignUpDto>]: string } = {}

    if (!errors) {
        newErrors.passwordConfirm = 'Ett fel inträffade'
        return newErrors
    }

    for (const validationError of errors) {
        if (validationError.property === 'email') {
            for (const constraint of Object.keys(validationError.constraints ?? {})) {
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
            for (const constraint of Object.keys(validationError.constraints ?? {})) {
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
            Object.keys(errors.find((x: any) => x.property === 'password')?.constraints || [])
                .length === 0
        ) {
            for (const constraint of Object.keys(validationError.constraints ?? {})) {
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

    return newErrors
}
