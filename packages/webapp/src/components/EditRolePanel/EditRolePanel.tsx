import { Button, TextField } from '@mewi/ui'
import { capitalize } from 'lodash'
import { Role, User } from '@mewi/prisma/index-browser'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { instance } from '@/lib/axios'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import styles from './EditRolePanel.module.scss'
import StyledLoader from '../StyledLoader'

export function EditRolePanel() {
    const [email, setEmail] = useState<string | undefined>()

    const { data, refetch, isLoading } = useQuery(
        'users',
        () => instance.get<User[]>(`/users?email=${email}`).then((res) => res.data),
        {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    )

    return (
        <div className='p-2 spce-y-2'>
            <h4 className='mb-2'>Hantera roller</h4>
            <div className='space-y-4 rounded bg-gray-150 p-2'>
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
                <div className='p-2 w-ful'>
                    {isLoading ? (
                        <div className='w-full flex justify-center'>
                            <StyledLoader />
                        </div>
                    ) : !data?.length ? (
                        <span>Inga användare hittades</span>
                    ) : (
                        <ul>
                            {data?.map((user) => (
                                <UserRolesWidget user={user} />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

interface UserRolesWidgetProps {
    user: User
}

export const UserRolesWidget = ({ user }: UserRolesWidgetProps) => {
    const queryClient = useQueryClient()
    const data = queryClient.getQueryData<User[] | undefined>('users')

    const updateUserMutation = useMutation(
        ({ user, newRole }: { user: User; newRole: Role }) =>
            instance.patch('/users/' + user.id, {
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

    const deleteUserRoleMutation = useMutation(
        ({ user, roleToDelete }: { user: User; roleToDelete: Role }) =>
            instance.patch('/users/' + user.id, {
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
        const rolesNotInUser: Role[] = []

        for (const role of Object.keys(Role)) {
            if (!roles.includes(role as Role)) {
                rolesNotInUser.push(role as Role)
            }
        }

        return rolesNotInUser
    }, [user.roles])

    return (
        <div className={styles['user-card']}>
            <span className={styles['email-text']}>{user.email}</span>
            <div className={styles['user-roles']}>
                {user.roles.map((key) => (
                    <span
                        className={styles['role-label']}
                        onClick={() =>
                            deleteUserRoleMutation.mutate({
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
                            updateUserMutation.mutate({
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
