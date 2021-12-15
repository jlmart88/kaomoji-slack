import express from 'express';
import crypto from 'crypto';
import { config } from 'kaomoji/config';
import { Document } from 'mongoose';
import qs from 'qs';
import moment from 'moment';
const router = express.Router();
import _ from 'lodash';

import slash from './slash';
import interaction from './interaction';
import optionsLoad from './options-load';

import UserTokenModel from 'kaomoji/models/oauth/userToken';
import kaomojiCommands from 'kaomoji/components/commands';

// check the signature
router.use((req, res, next) => {
    const timestamp = req.header('X-Slack-Request-Timestamp') || '0';
    if (moment.unix(Number.parseInt(timestamp)).add(5, 'minutes').isBefore(moment())) {
      // The request timestamp is more than five minutes from local time.
      // It could be a replay attack, so let's ignore it.
      const msg = 'Ignoring old request';
      console.log(msg);
      return res.status(401).send(msg);
    }

    const body = qs.stringify(req.body, { format:'RFC1738' });
    const sig_basestring = 'v0:' + timestamp + ':' + body;
    const hmac = crypto.createHmac('sha256', config.SLACK_SIGNING_SECRET)
      .update(sig_basestring)
      .digest('hex')
      .toString();

    const my_signature = Buffer.from('v0=' + hmac);
    const received_signature = Buffer.from(req.header('X-Slack-Signature') || '');
    const valid = crypto.timingSafeEqual(my_signature, received_signature);
    if (!valid) {
        const msg = 'Invalid X-Slack-Signature header';
        console.log(msg)
        // ignore until slack app is approved
        // return res.status(401).send(msg);
    }
    return next();
})

// parse out the user id and verification token
router.use('/slash', (req, res, next) => {
    req.user = req.body.user_id;
    req.token = req.body.token;
    return next();
});

// parse out the user id and verification token
router.use('(/interaction|/options-load)', (req, res, next) => {
    req.payload = JSON.parse(req.body.payload);
    if (_.isNil(req.payload)) return res.status(400).send();
    req.user = req.payload.user.id;
    req.token = req.payload.token;
    return next();
});

// attempt to get the user API token and attach it to the request
router.use((req, res, next) => {
    // try to get a user token
    console.log('looking for user token');
    return UserTokenModel.findOne({'user_id': req.user})
        .exec()
        .then((token: Document | null)=> {
            if (_.isNil(token)) {
                return res.send(kaomojiCommands.getNoUserTokenText(config.SERVER_URL));
            }
            console.log('found user token');
            req.token = token;
            return next();
        });
})

router.use('/slash', slash);

router.use('/interaction', interaction);

router.use('/options-load', optionsLoad);

export default router;
