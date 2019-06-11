import {
  createListMessage,
  createOptionsList
} from 'kaomoji/components/interactions/list/message';
import { respondToInteractiveAction } from 'kaomoji/components/interactions/utils';
import { KaomojiModel } from 'kaomoji/models/kaomoji';
import { Request, Response } from 'express';
import { Option } from '@slack/types';
import Debug from 'debug';
import { getSearchResults } from 'kaomoji/models/kaomoji/service';
import { ResponseMessage } from 'kaomoji/types/slack';
import _ from 'lodash';


const debug = Debug('interactions:list');

export const sendListOptions = async (req: Request, res: Response): Promise<Response | void> => {
  const query = req.payload.value;
  let optionsResponse: { options: Option[] };
  // this is the initial search request, so respond with a message
  const kaomojis: KaomojiModel[] | null = await getSearchResults(query);
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
  const { payload } = req;
  const isInitialRequest = !payload;
  if (isInitialRequest) {
    // this is the initial list request, so respond with the select search message
    slackResponse = createListMessage();
    return res.send(slackResponse);
  } else {
    // this is a follow up interaction, so parse out the selection and send an updated message
    const { actions } = payload;
    const action = actions[0];
    const selectedOption = action.selected_option;
    slackResponse = createListMessage(selectedOption);
    res.send({ text: 'OK'});
    await respondToInteractiveAction(req, slackResponse);
  }
};
