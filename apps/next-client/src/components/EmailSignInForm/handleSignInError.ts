import { FormError } from "@/lib/types/forms";
import type { EmailSignInDto } from "./EmailSignInDto";

export const handleSignInError = (): FormError<EmailSignInDto> => {
    return {
        password: "Felaktig e-postadress eller lösenord",
    };
};
