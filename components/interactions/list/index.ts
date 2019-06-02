import { Request, Response } from 'kaomoji/node_modules/@types/express';
import _ from 'lodash';

import listMessage from './message';
import interactionCallback from 'kaomoji/models/interactionCallback/service';
import kaomoji from 'kaomoji/models/kaomoji/service';

import Promise from 'bluebird';

const LIST_PAGE_LIMIT = 5;

export default {
  sendListMessage: sendListMessage
}

function sendListMessage(req: Request, res: Response) {
  var listParamsCallback;
  if (!_.isNil(req.payload)) {
    var searchCallbackId = req.payload.callback_id;
    listParamsCallback = interactionCallback.getListCallback(req.db, searchCallbackId)
      .then(listCallback => {
        if (_.isNil(listCallback)) throw 'Cannot interact with this message anymore';
        return [listCallback.limit, listCallback.offset];
      });
  } else {
    listParamsCallback = Promise.resolve([LIST_PAGE_LIMIT, 0]);
  }

  return listParamsCallback.spread((limit: number, offset: number) => {
    return [
      interactionCallback.createListCallback(req.db, limit, offset + limit),
      kaomoji.getSearchResults(
        req.db,
        null,
        offset,
        limit
      )
    ];
  })
    .spread((listCallback, kaomojis) => {
      if (_.isNil(kaomojis)) throw 'No kaomoji found in the database.';
      if (_.isNil(listCallback)) throw 'Kaomoji App experienced an error handling your request';

      var slackResponse = listMessage.createListMessage(listCallback, _.map(kaomojis, 'text'));
      return slackResponse;
    })
    .catch((err: any) => {
      console.log(err);
      var slackResponse = {
        text: err,
        response_type: 'ephemeral'
      };
      return slackResponse;
    })
    .then(result => {
      return res.send(result);
    });
}
