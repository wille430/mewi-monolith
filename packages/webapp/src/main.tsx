import ReactDOM from 'react-dom'
import './styles.scss'
import App from './App/App'
import 'babel-polyfill'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from 'store'
import setupInterceptors from 'api/setupInterceptors.'
import { StrictMode } from 'react'
import axios from 'axios'

if (window.Cypress || import.meta.env.DEV) {
    window.store = store
}

setupInterceptors(store)

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }) =>
                axios.get(('/' + queryKey[0]) as string).then((res) => res.data),
        },
    },
})

;(async () => {
    // const stripe = loadStripe('pk_test_51HkomQLTeDsRddXB98y0CDMDz7ZQZR1j2lEU0X0ooM8gPgJweFj3UD4NKnfxFh4YtVtKGWFuwhRjpukScJd0oOhJ00sfbhtE9e')

    ReactDOM.render(
        <StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {/* <Elements stripe={stripe}> */}
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                    {/* </Elements> */}
                </QueryClientProvider>
            </Provider>
        </StrictMode>,
        document.getElementById('root')
    )
})()
