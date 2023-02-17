import { getPwdValidationErrorMsg } from '@/client/common/errors'
import type SignUpDto from '@/lib/modules/auth/dto/sign-up.dto'
import { createValidationHandler } from '@/lib/utils/createValidationHandler'

export const handleSignUpError = createValidationHandler<SignUpDto>(
    (property, constraint, { errors }) => {
        switch (property) {
            case 'password':
                return getPwdValidationErrorMsg(constraint)
            case 'email':
                switch (constraint) {
                    case 'isEmail':
                        return 'E-postadressen är felaktig'
                    case 'isNotEmpty':
                        return 'Fältet kan inte vara tomt'
                    case 'UniqueEmail':
                        return 'E-postadressen är upptagen'
                }
                break
            case 'passwordConfirm':
                if (
                    Object.keys(
                        (errors as any).find((x: any) => x.property === 'password')?.constraints ||
                            []
                    ).length === 0
                ) {
                    switch (constraint) {
                        case 'Match':
                            // errors.password = 'Lösenorden måste matcha'
                            return 'Lösenorden måste matcha'
                        case 'isNotEmpty':
                            return 'Fältet kan inte vara tomt'
                    }
                }
                break
        }
    }
)
