import { Button, TextField, TextFieldProps } from '@mewi/ui'
import { useEffect, useState } from 'react'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import styles from './EditableField.module.scss'
import { FiCheck } from 'react-icons/fi'
import _ from 'lodash'

interface EditableFieldProps extends TextFieldProps {
    label: string
    onEditComplete?: (val?: string) => void
}

const EditableField = ({ label, onEditComplete, ...rest }: EditableFieldProps) => {
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
            {isEditing ? (
                <TextField
                    {...rest}
                    className={styles.editable}
                    value={_value}
                    onChange={(val) => _setValue(val)}
                    endComponent={[<Button onClick={handleEditComplete} icon={<FiCheck />} />]}
                />
            ) : (
                <div className={styles.noneditable}>
                    <input {..._.omit(rest, 'onChange')} disabled />
                    <Button icon={<MdOutlineModeEditOutline />} onClick={() => setEditing(true)} />
                </div>
            )}
        </div>
    )
}

export default EditableField
