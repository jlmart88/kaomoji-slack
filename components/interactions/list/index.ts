import {
  createLegacyListMessage,
  createListMessage,
  createOptionsList
} from 'kaomoji/components/interactions/list/message';
import { createSearchMessage } from 'kaomoji/components/interactions/search/message';
import { respondToInteractiveAction } from 'kaomoji/components/interactions/utils';
import { ListCallbackModel } from 'kaomoji/models/interactionCallback/listCallback';
import { KaomojiModel } from 'kaomoji/models/kaomoji';
import { Request, Response } from 'express';
import { Option } from '@slack/types';
import Debug from 'debug';
import { ResponseMessage } from 'kaomoji/types/slack';
import _ from 'lodash';

import interactionCallback from 'kaomoji/models/interactionCallback/service';
import kaomoji from 'kaomoji/models/kaomoji/service';

import BluebirdPromise from 'bluebird';

const debug = Debug('interactions:list');

const LEGACY_LIST_PAGE_LIMIT = 5;
const LIST_LIMIT = 100;

export const sendListOptions = async (req: Request, res: Response): Promise<Response | void> => {
  const query = req.payload.value;
  let optionsResponse: { options: Option[] };
  // this is the initial search request, so respond with a message
  const kaomojis: KaomojiModel[] | null = await kaomoji.getSearchResults(query, 0, LIST_LIMIT);
  if (_.isNil(kaomojis)) {
    const err = Error('No kaomoji found for "' + query + '".');
    debug(err);
    optionsResponse = createOptionsList([]);
  }
  else {
    optionsResponse = createOptionsList(kaomojis);
  }
  return res.send(optionsResponse);
};

export const sendListMessage = async (req: Request, res: Response): Promise<Response | void> => {
  let slackResponse: ResponseMessage;
  if (!req.payload) {
    // this is the initial list request, so respond with the select search message
    slackResponse = createListMessage();
    return res.send(slackResponse);
  } else {
    // this is a follow up interaction, so parse out the selection and send an updated message
    const { payload } = req;
    const { actions } = payload;
    const action = actions[0];
    const selectedOption = action.selected_option;
    slackResponse = createListMessage(selectedOption);
    res.send({ text: 'OK'});
    await respondToInteractiveAction(req, slackResponse);
  }
};

export function sendLegacyListMessage(req: Request, res: Response) {
  let listParamsCallback;
  if (!_.isNil(req.payload)) {
    const searchCallbackId = req.payload.callback_id;
    listParamsCallback = interactionCallback.getListCallback(searchCallbackId)
      .then(listCallback => {
        if (_.isNil(listCallback)) throw 'Cannot interact with this message anymore';
        return [listCallback.limit, listCallback.offset];
      });
  } else {
    listParamsCallback = BluebirdPromise.resolve([LEGACY_LIST_PAGE_LIMIT, 0]);
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

      const slackResponse = createLegacyListMessage(listCallback, _.map(kaomojis, 'text'));
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
