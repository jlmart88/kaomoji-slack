import kaomojiCommands from 'kaomoji/components/commands';
import { BLOCK_ID_PREFIX_DELIMITER, BLOCK_IDS } from 'kaomoji/components/interactions/constants';
import { config } from 'kaomoji/config';
import { SearchCallbackModel } from 'kaomoji/models/interactionCallback/searchCallback';
import { KaomojiModel } from 'kaomoji/models/kaomoji';
import { Request, Response } from 'express';
import Debug from 'debug';
import oauth from 'kaomoji/models/oauth/service';
import request from 'request';
import { ResponseMessage } from 'kaomoji/types/slack';
const debug = Debug('interactions:search');

import _ from 'lodash';

import { createLegacySearchMessage, createSearchMessage } from './message';
import interactionCallback from 'kaomoji/models/interactionCallback/service';
import kaomoji from 'kaomoji/models/kaomoji/service';

import BluebirdPromise from 'bluebird';

export const sendSearchMessage = async (req: Request, res: Response, query?: string): Promise<Response | void> => {
  let slackResponse: ResponseMessage;
  if (query) {
    // this is the initial search request, so respond with a message
    const kaomojis: KaomojiModel[] | null = await kaomoji.getSearchResults(query, 0, 10);
    if (_.isNil(kaomojis)) {
      const err = Error('No kaomoji found for "' + query + '".');
      debug(err);
      slackResponse = {
        text: err.message,
        response_type: 'ephemeral'
      };
    }
    else {
      slackResponse = createSearchMessage(query, kaomojis);
    }
    return res.send(slackResponse);
  } else {
    // this is a follow up interaction, so parse out the selection and send an updated message
    const { payload } = req;
    const { actions } = payload;
    const action = actions[0];
    const query = action.block_id.slice(BLOCK_IDS.KAOMOJI_SEARCH_SELECT.length + BLOCK_ID_PREFIX_DELIMITER.length);
    const kaomojis: KaomojiModel[] | null = await kaomoji.getSearchResults(query, 0, 10);
    if (_.isNil(kaomojis)) {
      const err = Error('No kaomoji found for "' + query + '".');
      debug(err);
      slackResponse = {
        text: err.message,
        response_type: 'ephemeral'
      };
    } else {
      const selectedOption = action.selected_option;
      slackResponse = createSearchMessage(query, kaomojis, selectedOption);
    }
    res.send({ text: 'OK'});
    await _updateSelectMessage(payload.response_url, slackResponse);
  }
};

const _updateSelectMessage = (url: string, updatedMessage: ResponseMessage) => {
  return request({
    url,
    body: updatedMessage,
    json: true,
    method: 'POST',
  });
}

export function sendLegacySearchMessage(req: Request, res: Response, query?: string) {
  let searchParamsCallback;
  if (_.isNil(query)) {
    const searchCallbackId = req.payload.callback_id;
    searchParamsCallback = interactionCallback.getSearchCallback(searchCallbackId)
      .then(searchCallback => {
        if (_.isNil(searchCallback)) throw 'Cannot interact with this message anymore';
        return [searchCallback.query, searchCallback.offset];
      });
  } else {
    searchParamsCallback = BluebirdPromise.resolve([query, 0]);
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

      const slackResponse = createLegacySearchMessage(searchCallback, kaomojis[0].text);
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
