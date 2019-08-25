'use strict'
const path = require('path');
const express = require('express');
//use async/await syntax
require('express-async-errors');

const bodyParser = require('body-parser');

const morgan = require('morgan');

const passport = require('passport');

const routes = require('./api/routes')

const middlewares = require('./api/middlewares')

const cors=require('cors')

const app = express();

app.use(cors());
// Serve static files....
app.use(express.static(__dirname + '/dist/angularnodejs'));

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

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/angularnodejs/index.html'));
});
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

app.listen(process.env.PORT || 8080);