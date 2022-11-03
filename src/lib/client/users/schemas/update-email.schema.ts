import { object, string } from "yup";

export const updateEmailSchema = object().shape({
    newEmail: string().email('Felaktig e-postadress').required('Fältet kan inte vara tomt')
})