var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var methods = require('methods');
var mongoose = require('mongoose');
var key = require('./env-config.js');

//connect to MongoDB MLABS database
mongoose.connect('mongodb://' + key.DB_USERNAME + ':' + key.DB_PASSWORD + key.DB_URL);

var app = express();

app.use(cors());
app.use(cookieParser());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('method-override')());

app.use(express.static(__dirname + '/dist'));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found :()');
    err.status = 404;
    next(err);
});

app.listen(3000, function () {
    console.log('DEV server listening on port 3000!');
});

module.exports = app;