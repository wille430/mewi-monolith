import { FormError } from '@/types/forms'
import { SignUpDto } from './SignUpDto'

export const handleSignUpError = (msg: any): FormError<SignUpDto> => {
    const newErrors: { [key in keyof Partial<SignUpDto>]: string } = {}

    if (!msg) {
        newErrors.passwordConfirm = 'Ett fel inträffades'
        return newErrors
    }

    for (const validationError of msg) {
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
            Object.keys(msg.find((x: any) => x.property === 'password')?.constraints || [])
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

    return newErrors
}
