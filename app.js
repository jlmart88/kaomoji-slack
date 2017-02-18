var express = require('express');
var logger = require('morgan');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var kaomoji = require('./routes/kaomoji');
var oauth = require('./routes/oauth');
var site = require('./routes/site');

var app = express();
var config = require('./config')(app);

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.staticRoot = path.join(__dirname, 'public');
    next();
});

var db = mongoose.connect(config.MONGODB_URI);

require('./models/kaomoji/bootstrap')(db);
console.log(app.get('env'));
// force https in production
if (app.get('env') === 'production') {
    app.use(function(req, res, next) {
        console.log(req.protocol, req.headers);
        if (req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https') return next();
        return res.redirect('https://' + req.headers.host + req.url);
    });
}

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
