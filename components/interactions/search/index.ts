import { SearchCallbackModel } from 'kaomoji/models/interactionCallback/searchCallback';
import { KaomojiModel } from 'kaomoji/models/kaomoji';
import { Request, Response } from 'express';

import _ from 'lodash';

import searchMessage from './message';
import interactionCallback from 'kaomoji/models/interactionCallback/service';
import kaomoji from 'kaomoji/models/kaomoji/service';

import Promise from 'bluebird';

export function sendSearchMessage(req: Request, res: Response, query?: string) {
  let searchParamsCallback;
  if (_.isNil(query)) {
    const searchCallbackId = req.payload.callback_id;
    searchParamsCallback = interactionCallback.getSearchCallback(searchCallbackId)
      .then(searchCallback => {
        if (_.isNil(searchCallback)) throw 'Cannot interact with this message anymore';
        return [searchCallback.query, searchCallback.offset];
      });
  } else {
    searchParamsCallback = Promise.resolve([query, 0]);
  }

  return searchParamsCallback
    .spread((query, offset) => {
      return [
        interactionCallback.createSearchCallback(query as string, offset as number + 1),
        kaomoji.getSearchResults(
          query as string,
          offset as number,
          1
        )
      ];
    })
    .spread(((searchCallback: SearchCallbackModel, kaomojis: KaomojiModel[] | null) => {
      if (_.isNil(kaomojis)) throw Error('No kaomoji found for "' + query + '".');
      if (_.isNil(searchCallback)) throw Error('Kaomoji App experienced an error handling your request');

      const slackResponse = searchMessage.createSearchMessage(searchCallback, kaomojis[0].text);
      return slackResponse;
    }) as any)
    .catch((err: Error) => {
      console.log(err);
      const slackResponse = {
        text: err.message,
        response_type: 'ephemeral'
      };
      return slackResponse;
    })
    .then(result => {
      return res.send(result);
    });
}
