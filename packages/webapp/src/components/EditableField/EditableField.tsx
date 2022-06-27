import { Button, TextField, TextFieldProps } from '@wille430/ui'
import { useEffect, useState } from 'react'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { FiCheck } from 'react-icons/fi'
import omit from 'lodash/omit'
import styles from './EditableField.module.scss'

interface EditableFieldProps extends TextFieldProps {
    label: string
    onEditComplete?: (val?: TextFieldProps['value']) => void
}

const EditableField = ({ label, onEditComplete, disabled, ...rest }: EditableFieldProps) => {
    const [isEditing, setEditing] = useState(false)
    const [_value, _setValue] = useState(rest.value)

    const handleEditComplete = () => {
        setEditing(false)
        onEditComplete && onEditComplete(_value)
    }

    useEffect(() => {
        _setValue(rest.value)
    }, [rest.value])

    return (
        <div>
            <label>{label}</label>
            {isEditing && !disabled ? (
                <TextField
                    {...rest}
                    className={styles.editable}
                    value={_value}
                    onChange={(e) => _setValue(e.target.value)}
                    endComponent={[<Button onClick={handleEditComplete} icon={<FiCheck />} />]}
                />
            ) : (
                <div className={styles.noneditable}>
                    <input {...omit(rest, 'onChange')} disabled />
                    {!disabled && (
                        <Button
                            icon={<MdOutlineModeEditOutline />}
                            onClick={() => setEditing(true)}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default EditableField
