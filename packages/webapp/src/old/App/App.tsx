import { lazy, Suspense, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Nav from 'components/Nav/Nav'
import Login from 'old/Routes/Login'
import PrivateRoute from 'components/PrivateRoute'
import PublicRoute from 'components/PublicRoute'
import ProtectedRoutes from 'old/Routes/ProtectedRoutes'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { onAuthLoad } from 'store/auth/creators'
import Page from 'components/Page'
import ForgottenPassword from 'old/Routes/ForgottenPassword/ForgottenPassword'
import ChangePassword from 'old/Routes/ChangePassword/ChangePassword'
import SnackbarHandler from 'components/SnackbarHandler'
import StyledLoader from 'components/StyledLoader'
import { ConnectedRouter } from 'connected-react-router'
import { history } from 'store/history'

// Routes
const Home = lazy(() => import('old/Routes/Home/index'))
const Search = lazy(() => import('old/Routes/Search'))
const Register = lazy(() => import('old/Routes/Register/Register'))
const Categories = lazy(() => import('old/Routes/Categories'))
const CategorySearch = lazy(() => import('old/Routes/CategorySearch'))

function App() {
    const isAuthenticated = useAppSelector((state) => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(onAuthLoad())
    }, [])

    return (
        <div className='min-h-screen w-full'>
            <ConnectedRouter history={history}>
                <Nav />
                <Suspense
                    fallback={
                        <div className='h-full w-full flex items-center justify-center'>
                            <StyledLoader />
                        </div>
                    }
                >
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
                            path={['/kategorier/:category_id']}
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
                        <PublicRoute
                            title='Glömt lösenord - Mewi.se'
                            exact
                            path='/glomtlosenord'
                            isAuthenticated={isAuthenticated}
                            component={<ForgottenPassword />}
                        />
                        <PublicRoute
                            title='Nytt lösenord - Mewi.se'
                            exact
                            path='/nyttlosenord'
                            isAuthenticated={isAuthenticated}
                            component={<ChangePassword />}
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
            </ConnectedRouter>
            <SnackbarHandler />
        </div>
    )
}

export default App
