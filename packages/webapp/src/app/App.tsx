import './App.css'
import { lazy, Suspense, useContext } from 'react'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Nav from 'common/components/Nav/index'
import { SearchProvider } from 'common/context/SearchContext'
// import useAuth from '../common/hooks/useAuth'
import Login from 'Routes/Login'
import PrivateRoute from 'common/components/PrivateRoute'
import PublicRoute from 'common/components/PublicRoute'
import ProtectedRoutes from 'Routes/ProtectedRoutes'
import { UserContext } from 'common/context/UserContext'

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

/*
const Authenticate = (setToken: Function, token: string | null) => {
  console.log("Authorizing...")

  const username = prompt("Username")
  const password = prompt("Password")

  if ((username === process.env.REACT_APP_ACCESS_USERNAME && password === process.env.REACT_APP_ACCESS_PASSWORD) || !(process.env.REACT_APP_ACCESS_USERNAME && process.env.REACT_APP_ACCESS_PASSWORD)) {
    console.log("Authorized")
    setToken(process.env.REACT_APP_ACCESS_TOKEN || "missing")
  } else {
    console.log("Invalid password or username")
  }
}
*/

function App() {
  // const { setToken, token } = useAuth()

  const userToken = useContext(UserContext).token
  const isAuthenticated = !!userToken

  // if (!token && process.env.REACT_APP_DEV !== "true") {
  //   return <button onClick={e => Authenticate(setToken, token)}>Log in</button>
  // } else if (token === process.env.REACT_APP_ACCESS_TOKEN || process.env.REACT_APP_DEV === "true") {
  //   return (
  //     <div className="w-full min-h-screen">
  //       <Router>
  //         <Nav />
  //         <Suspense fallback={<div></div>}>
  //           <Switch>
  //             <PublicRoute path="/login" isAuthenticated={isAuthenticated}>
  //               <Login />
  //             </PublicRoute>
  //             <PublicRoute path="/register" isAuthenticated={isAuthenticated} >
  //               <Register />
  //             </PublicRoute>
  //             <Route path={["/kategorier/:category_id/*", "/kategorier/:category_id"]} component={CategorySearch}/>
  //             <Route path="/kategorier" component={Categories} />
  //             <Route exact path="/" component={Home} />
  //             <Route exact path="/search">
  //               <SearchProvider>
  //                 <SearchContainer />
  //               </SearchProvider>
  //             </Route>
  //             <PrivateRoute
  //               path="/"
  //               isAuthenticated={isAuthenticated}
  //             >
  //               <ProtectedRoutes />
  //             </PrivateRoute>
  //             <Route path="*">
  //               <Redirect to={{ pathname: "/" }} />
  //             </Route>
  //           </Switch>
  //         </Suspense>
  //       </Router>
  //     </div>
  //   )
  // } else {
  //   return <>
  //     <h2>Unauthorized</h2>
  //     <h4>Invalid username or password</h4>
  //     <button onClick={e => Authenticate(setToken, token)}>Try again</button>
  //   </>
  // }

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
