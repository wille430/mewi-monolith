import faker from '@faker-js/faker'
import { FormEvent, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import { IUser } from '@wille430/common'
import { Button, TextField } from '@mewi/ui'
import styles from './AccountDetails.module.scss'
import classNames from 'classnames'
import { ApiErrorResponse } from 'types/types'

const AccountDetails = () => {
    const { data: user, isLoading } = useQuery<Partial<IUser>>(
        'me',
        () =>
            axios.get<IUser>('/users/me').then((res) => {
                setFormData(res.data)
                return res.data
            }),
        { initialData: { email: '' } }
    )

    const mutation = useMutation(() => axios.put('/users/email', { newEmail: formData?.email }), {
        onError: (e: ApiErrorResponse) => {
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
                `Ett meddelande har skickats till ${user?.email} för att verifiera adressen`
            ),
    })

    interface UpdateUserInfo {
        email?: string
    }

    const [formData, setFormData] = useState<UpdateUserInfo>(user || {})
    const [errors, setErrors] = useState<Record<keyof UpdateUserInfo | string, string>>({
        email: '',
    })
    const [success, setSuccess] = useState<string | undefined>()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        // TODO: mutate
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
                        onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
                        disabled={isLoading}
                        fullWidth
                    />
                    <span className='text-red-400'>{errors.email}</span>
                </div>
                <div>
                    <label>Lösenord</label>
                    <TextField
                        type='password'
                        value={faker.internet.password()}
                        disabled
                        fullWidth
                    />
                </div>
                <Button
                    className={classNames({
                        ['pointer-events-none opacity-0']: formData?.email === user?.email,
                    })}
                    type='submit'
                    label='Uppdatera'
                />
                <span className='text-green-500'>{success}</span>
            </form>
        </section>
    )
}

export default AccountDetails
