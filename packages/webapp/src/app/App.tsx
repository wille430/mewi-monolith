import './App.css'
import { lazy, Suspense, useContext, useEffect } from 'react'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Nav from 'common/components/Nav/index'
import { SearchProvider } from 'common/context/SearchContext'
import Login from 'Routes/Login'
import PrivateRoute from 'common/components/PrivateRoute'
import PublicRoute from 'common/components/PublicRoute'
import ProtectedRoutes from 'Routes/ProtectedRoutes'
import { UserContext } from 'common/context/UserContext'
import axios from 'axios'
import { data } from 'autoprefixer'
import { instance } from 'api'

// Routes
const Home = lazy(() => import('Routes/Home/index'))
const Search = lazy(() => import('Routes/Search'))
const Register = lazy(() => import('Routes/Register'))
const Categories = lazy(() => import('Routes/Categories'))
const CategorySearch = lazy(() => import('Routes/CategorySearch'))

if (!window.console) {
  var noOp = function () { } // no-op function
  // eslint-disable-next-line
  console = {
    ...console,
    log: noOp,
    warn: noOp,
    error: noOp
  }
}

function App() {
  const { token, logOut, renewJwt } = useContext(UserContext)
  const isAuthenticated = !!token

  useEffect(() => {

    axios.defaults.baseURL = process.env.NX_API_URL

    axios.interceptors.request.use(request => {
      if (request.headers && token) {
        request.headers['Authorization'] = 'Bearer ' + token
      }
      return request
    })

    axios.interceptors.response.use(
      response => {
        return response
      },
      async err => {
        const config = err.config
        if (err.response?.status === 401 && !config._retry) {
          config._retry = true
          await renewJwt()
          return instance(config)
        } else if (err.response?.status === 403) {
          logOut()
        } else if (err.response?.status === 401 && config._retry) {
          logOut()
        }

        if (err.response?.data) {
          throw err.response?.data
        }
        throw err
      })
  }, [token])

  return (
    <div className="w-full min-h-screen">
      <Router>
        <Nav />
        <Suspense fallback={<div></div>}>
          <Switch>
            <PublicRoute path="/login" isAuthenticated={isAuthenticated}>
              <Login />
            </PublicRoute>
            <PublicRoute path="/register" isAuthenticated={isAuthenticated} >
              <Register />
            </PublicRoute>
            <Route path={["/kategorier/:category_id/*", "/kategorier/:category_id"]} component={CategorySearch} />
            <Route path="/kategorier" component={Categories} />
            <Route exact path="/" component={Home} />
            <Route exact path="/search">
              <SearchProvider>
                <Search />
              </SearchProvider>
            </Route>
            <PrivateRoute
              path="/"
              isAuthenticated={isAuthenticated}
            >
              <ProtectedRoutes />
            </PrivateRoute>
            <Route path="*">
              <Redirect to={{ pathname: "/" }} />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
