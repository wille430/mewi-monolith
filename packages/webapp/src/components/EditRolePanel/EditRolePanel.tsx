import { Button, TextField } from '@wille430/ui'
import capitalize from 'lodash/capitalize'
import type { IUser } from '@wille430/common'
import { Role } from '@wille430/common'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import styles from './EditRolePanel.module.scss'
import StyledLoader from '../StyledLoader'
import { client } from '@/lib/client'

export function EditRolePanel() {
    const [email, setEmail] = useState<string | undefined>()

    const { data, refetch, isLoading } = useQuery(
        'users',
        () => client.get<IUser[]>(`/users?email=${email}`).then((res) => res.data),
        {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    )

    return (
        <div className='spce-y-2 p-2'>
            <h4 className='mb-2'>Hantera roller</h4>
            <div className='bg-gray-150 space-y-4 rounded p-2'>
                <form
                    className='flex max-w-sm'
                    onSubmit={(e) => {
                        e.preventDefault()
                        refetch()
                    }}
                >
                    <TextField
                        placeholder='E-postaddress'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <Button label='Sök' className='ml-1' type='submit' />
                </form>
                <div className='w-ful p-2'>
                    {isLoading ? (
                        <div className='flex w-full justify-center'>
                            <StyledLoader />
                        </div>
                    ) : !data?.length ? (
                        <span>Inga användare hittades</span>
                    ) : (
                        <ul>
                            {data?.map((user) => (
                                <IUserRolesWidget user={user} />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

interface IUserRolesWidgetProps {
    user: IUser
}

export const IUserRolesWidget = ({ user }: IUserRolesWidgetProps) => {
    const queryClient = useQueryClient()
    const data = queryClient.getQueryData<IUser[] | undefined>('users')

    const updateIUserMutation = useMutation(
        ({ user, newRole }: { user: IUser; newRole: Role }) =>
            client.patch('/users/' + user.id, {
                roles: [...user.roles, newRole],
            }),
        {
            onSuccess: (res, { user }) => {
                if (!data) {
                    return
                }
                const userIndex = data.findIndex((u) => u.id === user.id)

                data[userIndex] = res.data
                queryClient.setQueryData('users', data)
            },
        }
    )

    const deleteIUserRoleMutation = useMutation(
        ({ user, roleToDelete }: { user: IUser; roleToDelete: Role }) =>
            client.patch('/users/' + user.id, {
                roles: user.roles.filter((x) => x != roleToDelete),
            }),
        {
            onSuccess: (res, { user }) => {
                if (!data) {
                    return
                }
                const userIndex = data.findIndex((u) => u.id === user.id)

                data[userIndex] = res.data
                queryClient.setQueryData('users', data)
            },
        }
    )

    const missingRoles = useMemo(() => {
        const roles = user.roles
        const rolesNotInIUser: Role[] = []

        for (const role of Object.keys(Role)) {
            if (!roles.includes(role as Role)) {
                rolesNotInIUser.push(role as Role)
            }
        }

        return rolesNotInIUser
    }, [user.roles])

    return (
        <div className={styles['user-card']}>
            <span className={styles['email-text']}>{user.email}</span>
            <div className={styles['user-roles']}>
                {user.roles.map((key) => (
                    <span
                        className={styles['role-label']}
                        onClick={() =>
                            deleteIUserRoleMutation.mutate({
                                user,
                                roleToDelete: key,
                            })
                        }
                    >
                        {capitalize(key)}
                    </span>
                ))}

                {missingRoles.map((key) => (
                    <span
                        className={classNames({
                            [styles['role-label']]: true,
                            [styles['unselected']]: true,
                        })}
                        onClick={() =>
                            updateIUserMutation.mutate({
                                user,
                                newRole: key,
                            })
                        }
                    >
                        {capitalize(key)}
                    </span>
                ))}
            </div>
        </div>
    )
}
