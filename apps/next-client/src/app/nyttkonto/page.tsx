"use client"
import {SignUpForm} from '@/components/SignUpForm/SignUpForm'
import {useUser} from '@/hooks/useUser'
import {CreateAccountInformation} from '@/components/CreateAccountInformation'

const NyttKonto = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    return (
        <main className="p-4">
            <section className="divided-content section p-0" style={{marginTop: '15vh'}}>
                <div className="flex-grow p-4 py-16">
                    <h3 className="mb-8 text-center text-primary">Nytt konto</h3>
                    <SignUpForm/>
                </div>
                <CreateAccountInformation/>
            </section>
        </main>
    )
}

export default NyttKonto
