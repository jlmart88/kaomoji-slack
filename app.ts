import express from 'express';
import { ErrorRequestHandler } from 'express';
import logger from 'morgan';
import path from 'path';
const favicon = require('static-favicon');
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import debuglib from 'debug';
const debug = debuglib('kaomoji-slack');
import bluebird from 'bluebird';
(mongoose as any).Promise = bluebird;

import kaomoji from 'kaomoji/routes/kaomoji';
import oauth from 'kaomoji/routes/oauth';
import site from 'kaomoji/routes/site';
import { bootstrapDB } from 'kaomoji/models/kaomoji/bootstrap';
const app = express();
import { config } from 'kaomoji/config';

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

mongoose.connect(config.MONGODB_URI).then(() => bootstrapDB());


// force https in production
if (app.get('env') === 'production') {
  app.use(function (req, res, next) {
    if (req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https') return next();
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  });
}

app.use('/kaomoji', kaomoji);
app.use('/oauth', oauth);
app.use('/', site);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  (err as any).status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(((err, req, res, next) => {
    debug('Error while handling request:');
    debug(err);
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  }) as ErrorRequestHandler);
}

// production error handler
// no stacktraces leaked to user
app.use(((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
}) as ErrorRequestHandler);


export default app;
