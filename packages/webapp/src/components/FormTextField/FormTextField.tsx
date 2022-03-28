import { TextField, TextFieldProps } from '@mewi/ui'
import classNames from 'classnames'

interface FormTextFieldProps {
    textFieldProps: TextFieldProps
    errorMessage?: string
    successMessage?: string
}

const FormTextField = ({ textFieldProps, errorMessage, successMessage }: FormTextFieldProps) => {
    return (
        <div
            className={classNames({
                'w-full': textFieldProps.fullWidth,
            })}
        >
            <TextField {...textFieldProps} />
            {errorMessage ? (
                <span className='text-red-400'>{errorMessage}</span>
            ) : (
                <span className='text-green-400'>{successMessage}</span>
            )}
        </div>
    )
}

export default FormTextField
