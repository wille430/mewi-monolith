import './App.css'
import { lazy, Suspense, useEffect } from 'react'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Nav from 'common/components/Nav/index'
import { SearchProvider } from 'common/context/SearchContext'
import Login from 'Routes/Login'
import PrivateRoute from 'common/components/PrivateRoute'
import PublicRoute from 'common/components/PublicRoute'
import ProtectedRoutes from 'Routes/ProtectedRoutes'
import { useAppSelector } from 'common/hooks/hooks'
import { useDispatch } from 'react-redux'
import { onAuthLoad } from 'store/auth/creators'

// Routes
const Home = lazy(() => import('Routes/Home/index'))
const Search = lazy(() => import('Routes/Search'))
const Register = lazy(() => import('Routes/Register'))
const Categories = lazy(() => import('Routes/Categories'))
const CategorySearch = lazy(() => import('Routes/CategorySearch'))

if (!window.console) {
    var noOp = function () {} // no-op function
    // eslint-disable-next-line
    console = {
        ...console,
        log: noOp,
        warn: noOp,
        error: noOp,
    }
}

function App() {
    const isAuthenticated = useAppSelector((state) => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(onAuthLoad())
    }, [])

    return (
        <div className='w-full min-h-screen'>
            <Router>
                <Nav />
                <Suspense fallback={<div></div>}>
                    <Switch>
                        <PublicRoute path='/login' isAuthenticated={isAuthenticated}>
                            <Login />
                        </PublicRoute>
                        <PublicRoute path='/register' isAuthenticated={isAuthenticated}>
                            <Register />
                        </PublicRoute>
                        <Route
                            path={[
                                '/kategorier/:category_id/:subcat_id',
                                '/kategorier/:category_id',
                            ]}
                        >
                            <SearchProvider>
                                <CategorySearch />
                            </SearchProvider>
                        </Route>
                        <Route path='/kategorier' component={Categories} />
                        <Route exact path='/' component={Home} />
                        <Route exact path='/search'>
                            <SearchProvider>
                                <Search />
                            </SearchProvider>
                        </Route>
                        <PrivateRoute path='/' isAuthenticated={isAuthenticated}>
                            <ProtectedRoutes />
                        </PrivateRoute>
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
