var express = require('express');
var router = express.Router();
var kaomojiSearch = require('../components/kaomoji-search');

/* POST kaomoji-search. */
router.post('/kaomoji-search', function(req, res) {
    kaomojiSearch.kaomojiSearch(req.db, 'sad')
        .then(res.send.bind(res))
        .catch(console.error);
});

module.exports = router;
