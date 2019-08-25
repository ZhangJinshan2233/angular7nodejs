'use strict'
const express = require('express');
const path = require('path');
const http = require('http');

const app = require('./api');
// Serve static files....
app.use(express.static(__dirname + '/dist/angularnodejs'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/angularnodejs/index.html'));
});
const server = http.createServer(app);

let PORT = process.env.PORT || 3000;

server.listen(PORT, function () {

    console.log('server is runnung', PORT)

})