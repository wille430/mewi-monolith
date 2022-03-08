import './App.css'
import { lazy, Suspense, useEffect } from 'react'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Nav from 'components/Nav/Nav'
import Login from 'Routes/Login'
import PrivateRoute from 'components/PrivateRoute'
import PublicRoute from 'components/PublicRoute'
import ProtectedRoutes from 'Routes/ProtectedRoutes'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { onAuthLoad } from 'store/auth/creators'
import Page from 'components/Page'
import ForgottenPassword from 'Routes/ForgottenPassword/ForgottenPassword'

// Routes
const Home = lazy(() => import('Routes/Home/index'))
const Search = lazy(() => import('Routes/Search'))
const Register = lazy(() => import('Routes/Register'))
const Categories = lazy(() => import('Routes/Categories'))
const CategorySearch = lazy(() => import('Routes/CategorySearch'))

// if (!window.console) {
//     // const noOp = function () {} // no-op function
//     // eslint-disable-next-line
//     console = {
//         ...console,
//         log: noOp,
//         warn: noOp,
//         error: noOp,
//     }
// }

function App() {
    const isAuthenticated = useAppSelector((state) => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(onAuthLoad())
    }, [])

    return (
        <div className='min-h-screen w-full'>
            <Router>
                <Nav />
                <Suspense fallback={<div></div>}>
                    <Switch>
                        <PublicRoute
                            title='Logga in - Mewi.se'
                            path='/login'
                            isAuthenticated={isAuthenticated}
                            component={<Login />}
                        />
                        <PublicRoute
                            title='Skapa konto - Mewi.se'
                            path='/register'
                            isAuthenticated={isAuthenticated}
                            component={<Register />}
                        />
                        <Page
                            title='Sök - Mewi.se'
                            path={[
                                '/kategorier/:category_id/:subcat_id',
                                '/kategorier/:category_id',
                            ]}
                            component={<CategorySearch />}
                        />
                        <Page
                            title='Alla kategorier - Mewi.se'
                            path='/kategorier'
                            component={<Categories />}
                        />
                        <Page title='Sök - Mewi.se' exact path='/search' component={<Search />} />
                        <Page
                            title='Hitta begagnade produkter på ett enda ställe - Mewi.se '
                            exact
                            path='/'
                            component={<Home />}
                        />
                        <Page
                            title='Glömt lösenord - Mewi.se'
                            exact
                            path='/glomtlosenord'
                            component={<ForgottenPassword />}
                        />
                        <PrivateRoute
                            path='/'
                            isAuthenticated={isAuthenticated}
                            component={<ProtectedRoutes />}
                        />
                        <Route path='*'>
                            <Redirect to={{ pathname: '/' }} />
                        </Route>
                    </Switch>
                </Suspense>
            </Router>
        </div>
    )
}

export default App
