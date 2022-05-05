import { SignInWithEmail } from './SignInWithEmail/SignInWithEmail'
import Layout from 'components/Layout'
import { Route } from 'react-router'
import SignInWithList from 'old/Routes/Login/SignInWithList/SignInWithList'

const Login = () => {
    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Route path='/login' exact>
                    <SignInWithList />
                </Route>
                <Route path='/login/email' exact>
                    <SignInWithEmail />
                </Route>
            </main>
            <aside className='side-col'></aside>
        </Layout>
    )
}

export default Login
