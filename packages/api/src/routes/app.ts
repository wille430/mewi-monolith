import express from 'express'
import cors from 'cors'
import notFound from './404'
import * as dotenv from 'dotenv'
import checkEnv from 'config/check-env'
import db from 'config/database'
import morgan from 'morgan'

/** Routes */
import items from './items'
import user from './user'
import payment from './payment'
import search from './search'
import auth from './auth'
import test from './test'
import errorHandler from './errorHandler'
import featured from './featured'

const app = express()

dotenv.config()
db.connect()
checkEnv()

// Add middlewares
app.use(cors()) // !!! TODO BLOCK ORIGIN WHICH ISNT FROM FRONT-END SERVER !!!
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(express.static('public'))

// Routes
app.use('/items', items)
app.use('/user', user)
app.use('/payment', payment)
app.use('/search', search)
app.use('/auth', auth)
app.use('/test', test)
app.use('/featured', featured)

app.use('/', (req, res) => {
    res.json({
        message: 'Mewi API',
        type: 'info',
    })
})

app.use(notFound)
app.use(errorHandler)

export default app
