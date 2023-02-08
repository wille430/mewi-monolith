import { getPwdValidationErrorMsg } from '@/lib/client/common/errors'
import { ChangePasswordWithToken } from '@/lib/modules/users/dto/change-password.dto'
import { createValidationHandler } from '@/lib/utils/createValidationHandler'

export const handleError = createValidationHandler<ChangePasswordWithToken>(
    (property, constraint, { errors }) => {
        switch (property) {
            case 'password':
                if (constraint === 'isNew') {
                    return 'Lösenordet är för likt ditt gamla. Var vänlig använd ett mer unikt lösenord.'
                } else {
                    return getPwdValidationErrorMsg(constraint)
                }
            case 'passwordConfirm':
                switch (constraint) {
                    case 'Match':
                        // errors.password = 'Lösenorden måste matcha'
                        return 'Lösenorden måste matcha'
                    case 'isNotEmpty':
                        return 'Fältet kan inte vara tomt'
                    default:
                        return getPwdValidationErrorMsg(constraint)
                }
                break
            case 'token':
                errors.all =
                    'Länken är felaktig. Var vänlig be om en ny lösenordåterställning för att försöka igen.'
                break
        }
    }
)
