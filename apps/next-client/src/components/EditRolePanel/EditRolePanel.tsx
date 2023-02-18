"use client"
import capitalize from 'lodash/capitalize'
import {useMemo, useState} from 'react'
import styles from './EditRolePanel.module.scss'
import StyledLoader from '../StyledLoader'
import {TextField} from '../TextField/TextField'
import {Button} from '../Button/Button'
import useSWR, {useSWRConfig} from 'swr'
import {ALL_USERS_KEY} from '@/client/users/swr-keys'
import {getUsers} from '@/client/users/queries'
import {updateUserRoles} from '@/client/users/mutations'
import clsx from 'clsx'
import {Role, UserDto} from "@mewi/models"

export function EditRolePanel() {
    const [email, setEmail] = useState<string | undefined>()

    const {data, mutate: refetch} = useSWR(ALL_USERS_KEY, () => getUsers({email}))

    return (
        <div className="spce-y-2 p-2">
            <h4 className="mb-2">Hantera roller</h4>
            <div className="bg-gray-150 space-y-4 rounded p-2">
                <form
                    className="flex max-w-sm"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await refetch()
                    }}
                >
                    <TextField
                        placeholder="E-postaddress"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <Button className="ml-1" type="submit">
                        Sök
                    </Button>
                </form>
                <div className="w-ful p-2">
                    {!data ? (
                        <div className="flex w-full justify-center">
                            <StyledLoader/>
                        </div>
                    ) : !data?.length ? (
                        <span>Inga användare hittades</span>
                    ) : (
                        <ul>
                            {data?.map((user) => (
                                <UserRolesWidget key={user.id} user={user}/>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

interface UserRolesWidgetProps {
    user: UserDto
}

export const UserRolesWidget = ({user}: UserRolesWidgetProps) => {
    const {mutate} = useSWRConfig()

    const missingRoles = useMemo(() => {
        const roles = user.roles
        const rolesNotInUserDto: Role[] = []

        for (const role of Object.keys(Role)) {
            if (!roles.includes(role as Role)) {
                rolesNotInUserDto.push(role as Role)
            }
        }

        return rolesNotInUserDto
    }, [user.roles])

    const removeRole = (role: Role) => {
        return mutate(
            ...updateUserRoles(
                user.id,
                user.roles.filter((r) => r !== role)
            )
        )
    }

    const addRole = (role: Role) => {
        return mutate(...updateUserRoles(user.id, [...user.roles, role]))
    }

    return (
        <div className={styles['user-card']}>
            <span className={styles['email-text']}>{user.email}</span>
            <div className={styles['user-roles']}>
                {user.roles.map((role) => (
                    <span
                        key={role}
                        className={styles['role-label']}
                        onClick={() => removeRole(role)}
                    >
                        {capitalize(role)}
                    </span>
                ))}

                {missingRoles.map((role) => (
                    <span
                        key={role}
                        className={clsx({
                            [styles['role-label']]: true,
                            [styles['unselected']]: true,
                        })}
                        onClick={() => addRole(role)}
                    >
                        {capitalize(role)}
                    </span>
                ))}
            </div>
        </div>
    )
}
