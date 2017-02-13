var express = require('express');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var kaomoji = require('./routes/kaomoji');
var oauth = require('./routes/oauth');
var site = require('./routes/site');

var app = express();
var config = require('./config')(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var db = mongoose.connect(config.MONGODB_URI);

require('./models/kaomoji/bootstrap')(db);

app.use(function(req, res, next) {
    req.db = db;
    req.config = config;
    next();
});

app.use('/kaomoji', kaomoji);
app.use('/oauth', oauth);
app.use('/', site);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});


module.exports = app;
