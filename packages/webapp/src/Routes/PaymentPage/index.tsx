import Layout from 'components/Layout'
import StyledLoader from 'components/StyledLoader'
import { createRef, useEffect } from 'react'

const PaymentPage = () => {
    const sessionUrl = process.env.NX_API_URL + '(payment/new_session'

    const formRef = createRef<HTMLFormElement>()

    useEffect(() => {
        formRef.current?.submit()
    })

    return (
        <Layout>
            <aside className='side-col' />
            <main className='main'>
                <form ref={formRef} action={sessionUrl} method='POST'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <StyledLoader />
                    </div>
                </form>
            </main>
            <aside className='side-col' />
        </Layout>
    )
}

export default PaymentPage
