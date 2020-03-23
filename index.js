const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')
require('dotenv').config()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

//mongodb connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then( () => {
    console.log('Connection has been made, now make fireworks...')
})

//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//define routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', require('./routes/user-routes'))
app.use('/api/v1', require('./routes/player-routes'))
app.use('/api/v1', require('./routes/coach-routes'))

//routes
app.get('/', (req, res) => {
    res.send('Hi')
})

//listen on port 8000
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})