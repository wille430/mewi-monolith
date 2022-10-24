import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { container } from 'tsyringe'
import { UsersRepository } from '@/backend/modules/users/users.repository'

const repository = container.resolve(UsersRepository)

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: 'local',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'text' },
            },
            // TODO: fix auth
            authorize: async (credentials) => {
                if (!credentials) return null

                const { email, password } = credentials

                if (!email || !password) return null

                const user = await repository.findOne({
                    email,
                })

                if (!user || !user.password) {
                    return null
                }

                const validPassword = await compare(password, user.password)
                if (!validPassword) return null

                return { id: user.id, roles: user.roles }
            },
        }),
    ],
}

export default NextAuth(authOptions)
