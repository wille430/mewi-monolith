"use client"
import {EmailSignInForm} from '@/components/EmailSignInForm/EmailSignInForm'
import {useUser} from '@/hooks/useUser'
import {CreateAccountInformation} from '@/components/CreateAccountInformation'

const Login = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    return (
        <main className="p-4">
            <section className="divided-content section p-0" style={{marginTop: '15vh'}}>
                <div className="flex-grow p-4 py-16">
                    <h3 className="mb-8 text-center text-primary">Logga in</h3>
                    <EmailSignInForm/>
                </div>
                <CreateAccountInformation/>
            </section>
        </main>
    )
}

export default Login
