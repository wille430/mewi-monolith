import type { EmailSignInDto } from './EmailSignInDto'
import type { FormError } from '@/types/forms'

export const handleSignInError = (): FormError<EmailSignInDto> => {
    return {
        password: 'Felaktig e-postadress eller lösenord',
    }
}
