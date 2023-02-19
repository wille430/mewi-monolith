import { TextField, TextFieldProps } from "../TextField/TextField";

export const LabeledTextField = ({ label, ...rest }: TextFieldProps & { label?: string }) => (
    <div>
        <label className='inline-block h-8'>{label}</label>
        <TextField {...rest} />
    </div>
);
