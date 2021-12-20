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

// Routes
const Home = lazy(() => import('Routes/Home/index'))
const SearchContainer = lazy(() => import('Routes/Search/SearchContainer'))
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
  const userToken = useContext(UserContext).token
  const isAuthenticated = !!userToken

  useEffect(() => {

    axios.defaults.baseURL = process.env.NX_API_URL

    axios.interceptors.request.use(request => {
      if (request.headers && userToken) {
        request.headers['Authorization'] = 'Bearer ' + userToken
      }
      return request
    })

    axios.interceptors.response.use(
      response => {
        return response
      },
      err => {
        if (err.response?.data) {
          throw err.response?.data
        }
        throw err
      })
  }, [userToken])

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
                <SearchContainer />
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
