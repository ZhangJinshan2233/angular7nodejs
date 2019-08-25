'use strict'

const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.connection;
const User = require('./userModel')

mongoose.connect(config.dbUrl, {
    socketTimeoutMS: 3000000,
    keepAlive: 3000000,
    useNewUrlParser: true,
    autoIndex: false
})

connection.on('open', function () {
    console.log('MongoDB database connection established successfully!');
});

connection.on('error', function (err) {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
})

module.exports = {
    User
}