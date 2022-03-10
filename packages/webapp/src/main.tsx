import React from 'react'
import ReactDOM from 'react-dom'
import 'styles.scss'
import App from './app/App'
import 'babel-polyfill'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from 'store'
// import { loadStripe } from '@stripe/stripe-js'
// import { Elements } from '@stripe/react-stripe-js'
import setupInterceptors from 'api/setupInterceptors.'

if (window.Cypress) {
    window.store = store
}

;(async () => {
    // const stripe = loadStripe('pk_test_51HkomQLTeDsRddXB98y0CDMDz7ZQZR1j2lEU0X0ooM8gPgJweFj3UD4NKnfxFh4YtVtKGWFuwhRjpukScJd0oOhJ00sfbhtE9e')

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                {/* <Elements stripe={stripe}> */}
                <BrowserRouter>
                    <App />
                </BrowserRouter>
                {/* </Elements> */}
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    )
})()

setupInterceptors(store)
