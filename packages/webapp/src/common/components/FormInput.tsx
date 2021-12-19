import { Input } from "postcss"
import { HTMLAttributes } from "react"
import InputWithErrors from "./InputWithErrors"

interface Props {
    label: string,
    errorMessage: string | null | undefined,
    [key: string]: HTMLAttributes<Input> | any
}


const FormInput = ({ label, errorMessage, ...rest }: Props) => {
    return (
        <label>
            <span className="text-sm">{label}</span>
            <br />
            <InputWithErrors
                errorMessage={errorMessage}
                {...rest}
            />
        </label>
    )
}

export default FormInput