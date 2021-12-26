import React from 'react'
import ReactDOM from 'react-dom'
import 'styles.css'
import App from './app/App'
import SnackbarProvider from 'common/context/SnackbarContext'
import UserProvider from 'common/context/UserContext'

import { BrowserRouter } from 'react-router-dom'
// import { loadStripe } from '@stripe/stripe-js'
// import { Elements } from '@stripe/react-stripe-js'

console.log('ENV VARIABLES: ')
console.log(process.env)
;(async () => {
    // const stripe = loadStripe('pk_test_51HkomQLTeDsRddXB98y0CDMDz7ZQZR1j2lEU0X0ooM8gPgJweFj3UD4NKnfxFh4YtVtKGWFuwhRjpukScJd0oOhJ00sfbhtE9e')

    ReactDOM.render(
        <React.StrictMode>
            <SnackbarProvider>
                <UserProvider>
                    {/* <Elements stripe={stripe}> */}
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                    {/* </Elements> */}
                </UserProvider>
            </SnackbarProvider>
        </React.StrictMode>,
        document.getElementById('root')
    )
})()
