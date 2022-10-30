import type { FormEvent } from 'react'
import { useState } from 'react'
import { useMutation } from 'react-query'
import type { IUser } from '@wille430/common'
import { LoginStrategy } from '@wille430/common'
import { Button, TextField } from '@wille430/ui'
import { randomString } from '@wille430/common'
import styles from './AccountDetails.module.scss'
import { client } from '@/lib/client'

export interface AccountDetailsProps {
    user: IUser
}

const AccountDetails = ({ user }: AccountDetailsProps) => {
    const mutation = useMutation(() => client.put('/users/email', { newEmail: formData?.email }), {
        onError: (e: any) => {
            setSuccess(undefined)
            const newErrors: typeof errors = {}
            for (const error of e.message) {
                for (const constraint of Object.keys(error.constraints)) {
                    switch (constraint) {
                        case 'isEmail':
                            newErrors.email = 'Felaktig e-postadress'
                            break
                        case 'UniqueEmail':
                            newErrors.email = 'E-postadressen är upptagen'
                            break
                    }
                }
            }
            setErrors(newErrors)
        },
        onMutate: () => {
            setSuccess(undefined)
            setErrors({})
        },
        onSuccess: () =>
            setSuccess(
                `Ett meddelande har skickats till ${formData.email} för att verifiera adressen`
            ),
    })

    interface UpdateIUserInfo {
        email?: string
    }

    const [formData, setFormData] = useState<UpdateIUserInfo>(user || {})
    const [errors, setErrors] = useState<Record<keyof UpdateIUserInfo | string, string>>({
        email: '',
    })
    const [success, setSuccess] = useState<string | undefined>()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (
            formData?.email !== user?.email &&
            confirm(
                `Är du säker att du vill uppdatera din e-postadress från ${user?.email} till ${formData?.email}?`
            )
        ) {
            mutation.mutate()
        }
    }

    return (
        <section className={styles.container}>
            <h4>Kontouppgifter</h4>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label>E-postaddress</label>
                    <TextField
                        value={formData?.email}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        disabled={user?.loginStrategy !== LoginStrategy.LOCAL || mutation.isLoading}
                        fullWidth
                    />
                    <span className='text-red-400'>{errors.email}</span>
                </div>
                <div>
                    <label>Lösenord</label>
                    <TextField type='password' value={randomString(16)} disabled fullWidth />
                </div>
                <Button type='submit' label='Uppdatera' />
                <span className='text-green-500'>{success}</span>
            </form>
        </section>
    )
}

export default AccountDetails
