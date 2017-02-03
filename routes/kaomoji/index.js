var express = require('express');
var router = express.Router();

var slash = require('./slash');
var interaction = require('./interaction');

router.use('/slash', slash);

router.use('/interaction', interaction);

module.exports = router;