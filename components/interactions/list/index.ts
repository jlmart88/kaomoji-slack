import { ListCallbackModel } from 'kaomoji/models/interactionCallback/listCallback';
import { KaomojiModel } from 'kaomoji/models/kaomoji';
import { Request, Response } from 'express';
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
  let listParamsCallback;
  if (!_.isNil(req.payload)) {
    const searchCallbackId = req.payload.callback_id;
    listParamsCallback = interactionCallback.getListCallback(searchCallbackId)
      .then(listCallback => {
        if (_.isNil(listCallback)) throw 'Cannot interact with this message anymore';
        return [listCallback.limit, listCallback.offset];
      });
  } else {
    listParamsCallback = Promise.resolve([LIST_PAGE_LIMIT, 0]);
  }

  return listParamsCallback
    .spread((limit: number, offset: number) => {
      return [
        interactionCallback.createListCallback(limit, offset + limit),
        kaomoji.getSearchResults(
          null,
          offset,
          limit
        )
      ];
    })
    .spread(((listCallback: ListCallbackModel, kaomojis: KaomojiModel[] | null) => {
      if (_.isNil(kaomojis)) throw 'No kaomoji found in the database.';
      if (_.isNil(listCallback)) throw 'Kaomoji App experienced an error handling your request';

      const slackResponse = listMessage.createListMessage(listCallback, _.map(kaomojis, 'text'));
      return slackResponse;
    }) as any)
    .catch((err: any) => {
      console.log(err);
      const slackResponse = {
        text: err,
        response_type: 'ephemeral'
      };
      return slackResponse;
    })
    .then(result => {
      return res.send(result);
    });
}
