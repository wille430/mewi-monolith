import { Button, TextField } from '@mewi/ui'
import { capitalize } from 'lodash'
import { Role, User } from '@mewi/prisma/index-browser'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import { useState } from 'react'
import styles from './EditRolePanel.module.scss'

export function EditRolePanel() {
    const [email, setEmail] = useState<string | undefined>()

    const { data, refetch } = useQuery('user', () =>
        axios.get<User[]>(`/users?email=${email}`).then((res) => res.data)
    )

    const updateUserMutation = useMutation(
        ({ user, newRole }: { user: User; newRole: Role }) =>
            axios.patch('/users/' + user.id, {
                roles: [...user.roles, newRole],
            }),
        {
            onSuccess: (res, { user }) => {
                const userIndex = data.findIndex((u) => u.id === user.id)

                data[userIndex] = res.data
            },
        }
    )

    const deleteUserRoleMutation = useMutation(
        ({ user, roleToDelete }: { user: User; roleToDelete: Role }) =>
            axios.patch('/users/' + user.id, {
                roles: user.roles.filter((x) => x != roleToDelete),
            }),
        {
            onSuccess: (res, { user }) => {
                const userIndex = data.findIndex((u) => u.id === user.id)

                data[userIndex] = res.data
            },
        }
    )

    return (
        <div className='p-2 spce-y-2'>
            <h4 className='mb-2'>Hantera roller</h4>
            <div className='space-y-4 rounded bg-gray-100'>
                <div className='flex max-w-sm'>
                    <TextField
                        placeholder='E-postaddress'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <Button label='Sök' className='ml-1' onClick={() => refetch()} />
                </div>
                <div className='p-2'>
                    {!data?.length ? (
                        <span>Inga användare hittades</span>
                    ) : (
                        <ul>
                            {data?.map((user) => (
                                <div className={styles['user-card']}>
                                    <div className='flex'>
                                        <span className={styles['email-text']}>{user.email}</span>
                                        <select
                                            className={styles['role-selection']}
                                            disabled={updateUserMutation.isLoading}
                                            onChange={(e) =>
                                                updateUserMutation.mutate({
                                                    user,
                                                    newRole: e.target.value as Role,
                                                })
                                            }
                                        >
                                            <option selected>Välj en roll...</option>
                                            {Object.keys(Role)
                                                .filter((role) => !user.roles.includes(role))
                                                .map((key) => (
                                                    <option value={key}>{capitalize(key)}</option>
                                                ))}
                                        </select>
                                    </div>
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
                                    </div>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
