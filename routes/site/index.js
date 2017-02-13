var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('index.html');
});

module.exports = router;