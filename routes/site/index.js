var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('index.html', {root:req.staticRoot});
});

router.get('/privacy', (req, res) => {
    res.sendFile('privacy.html', {root:req.staticRoot});
});

router.get('/success', (req, res) => {
    res.sendFile('success.html', {root:req.staticRoot});
});

router.get('/faq', (req, res) => {
    res.sendFile('faq.html', {root:req.staticRoot});
})

module.exports = router;