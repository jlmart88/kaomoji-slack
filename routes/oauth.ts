import express from 'express';
import { config } from 'kaomoji/config';
import request from 'request';
const router = express.Router();
import UserTokenModel from 'kaomoji/models/oauth/userToken';

/* GET oauth */
router.get('/', (req, res) => {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    console.log("Looks like we're not getting a code.");
    res.redirect('/');
  } else {
    // If it's there...

    // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
    request({
      url: 'https://slack.com/api/oauth.access', //URL to hit
      qs: {
        code: req.query.code,
        client_id: config.SLACK_CLIENT_ID,
        client_secret: config.SLACK_CLIENT_SECRET
      }, //Query string data
      method: 'GET', //Specify the method

    }, function (error, response, body) {
      if (error) {
        console.error(error);
        res.status(500);
        return res.send({Error: error});
      } else {
        body = JSON.parse(body);
        console.log('oauth', body);
        var query;
        var UserToken = UserTokenModel(req.db);
        console.log('userToken', body.user_id);
        query = {'user_id': body.user_id};

        // Upsert this new token
        UserToken.findOneAndUpdate(query, body, {upsert: true, new: true})
          .exec()
          .then((doc: any) => {
            return res.redirect('/success');
          })
          .catch((err: any) => {
            console.error(err);
            res.status(500);
            return res.send({Error: err});
          });
      }
    })
  }
});

router.get('/signin', (req, res) => {
  res.redirect('https://slack.com/oauth/authorize?scope=commands+chat:write:user&client_id=' + config.SLACK_CLIENT_ID);
});

export default router;
