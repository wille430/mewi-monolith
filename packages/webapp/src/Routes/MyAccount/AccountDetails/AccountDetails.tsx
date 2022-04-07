import faker from '@faker-js/faker'
import { FormEvent, useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { IUser } from '@wille430/common/types'
import { Button, TextField } from '@mewi/ui'
import styles from './AccountDetails.module.scss'

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

    const [formData, setFormData] = useState(user)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        // TODO: mutate
        alert('Ändrar uppgifterna till: ' + JSON.stringify(formData))
    }

    return (
        <section>
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
                <Button type='submit' label='Uppdatera' />
            </form>
        </section>
    )
}

export default AccountDetails
