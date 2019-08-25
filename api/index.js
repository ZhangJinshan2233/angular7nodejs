'use strict'
const express = require('express');
//use async/await syntax
require('express-async-errors');

const bodyParser = require('body-parser');

const morgan = require('morgan');

const passport = require('passport');

const routes = require('./routes/userRoute')

const middlewares = require('./middlewares')

const cors=require('cors')

const app = express();

app.use(cors());

app.use(bodyParser.json({
    limit: '10mb'
}));

app.use(bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 100000
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(morgan('dev'));

// refer to routes
app.use('/api', routes)

// error handler for not existed api
app.use(function (req, res, next) {
    const err = new Error('not Found Api');
    err.status = 404
    next(err);
})

//error handler for all kinds of error
app.use(function (err, req, res, next) {
    res.status(err.status||400)
        .json({
            error: err.message
        })
})


module.exports = app