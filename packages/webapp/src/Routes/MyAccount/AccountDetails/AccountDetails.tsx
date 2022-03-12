import EditableField from 'components/EditableField/EditableField'
import faker from '@faker-js/faker'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getInfo, updateUserInfo } from 'store/user/creator'
import { useEffect } from 'react'

const AccountDetails = () => {
    const userState = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getInfo())
    }, [])

    return (
        <section>
            <h4>Kontouppgifter</h4>
            <EditableField
                label='E-post'
                value={userState.email}
                onEditComplete={(val) => dispatch(updateUserInfo({ field: 'email', new_val: val }))}
            />
            <EditableField
                label='Lösenord'
                type='password'
                value={faker.internet.password()}
                disabled
            />
        </section>
    )
}

export default AccountDetails
