var express = require('express');
var router = express.Router();
var _ = require('lodash');

var slash = require('./slash');
var interaction = require('./interaction');

var UserTokenModel = require('../../models/oauth/userToken');
var kaomojiCommands = require('../../components/commands');

// parse out the user id
router.use('/slash', (req, res, next) => {
    req.user = req.body.user_id;
    next();
});

// parse out the user id
router.use('/interaction', (req, res, next) => {
    req.payload = JSON.parse(req.body.payload);
    req.user = req.payload.user.id;
    next();
})

// attempt to get the user API token and attach it to the request
router.use((req, res, next) => {
    // try to get a user token
    var UserToken = UserTokenModel(req.db);
    console.log('looking for user token');
    return UserToken.findOne({'user.id': req.user})
        .exec()
        .then(token => {
            if (_.isNil(token)) {
                return res.send(kaomojiCommands.getNoUserTokenText());
            }
            console.log('found user token');
            req.token = token;
            return next();
        });
})

router.use('/slash', slash);

router.use('/interaction', interaction);

module.exports = router;