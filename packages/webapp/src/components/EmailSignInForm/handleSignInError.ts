import { FormError } from '@/types/forms'
import { EmailSignInDto } from './EmailSignInDto'

export const handleSignInError = (): FormError<EmailSignInDto> => {
    return {
        password: 'Felaktig e-postadress eller lösenord',
    }
}
