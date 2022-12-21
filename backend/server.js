const express = require('express')
require('dotenv').config()

const bodyParser = require("body-parser")

const {errorHandler} = require('./middleware/errorMiddleware')
// const {acceptJsonOnly} = require('./middleware/contentTypeMiddleware')
const router = require('./routes/Routes')
const connectDB = require('./config/db');

connectDB()

const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))

// parse application json
app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/players', router)

app.use(errorHandler)
// app.use(acceptJsonOnly)

app.listen(8000, () => console.log('Application is running'));
