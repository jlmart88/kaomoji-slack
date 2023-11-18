import Debug from "debug";
import { Request, Response } from "express";
import {
  BLOCK_ID_PREFIX_DELIMITER,
  BLOCK_IDS,
} from "@/components/interactions/constants";
import { respondToInteractiveAction } from "@/components/interactions/utils";
import { KaomojiModel } from "@/models/kaomoji";
import { getSearchResults } from "@/models/kaomoji/service";
import { ResponseMessage } from "@/types/slack";
import _ from "lodash";

import { createSearchMessage } from "./message";

const debug = Debug("interactions:search");

export const sendSearchMessage = async (
  req: Request,
  res: Response,
  query?: string
): Promise<Response | void> => {
  let slackResponse: ResponseMessage;
  if (query) {
    // this is the initial search request, so respond with a message
    const kaomojis: KaomojiModel[] | null = await getSearchResults(query);
    if (_.isNil(kaomojis)) {
      const err = Error('No kaomoji found for "' + query + '".');
      debug(err);
      slackResponse = {
        text: err.message,
        response_type: "ephemeral",
      };
    } else {
      slackResponse = createSearchMessage(query, kaomojis);
    }
    return res.send(slackResponse);
  } else {
    // this is a follow up interaction, so parse out the selection and send an updated message
    const { payload } = req;
    const { actions } = payload;
    const action = actions[0];
    const query = action.block_id.slice(
      BLOCK_IDS.KAOMOJI_SEARCH_SELECT.length + BLOCK_ID_PREFIX_DELIMITER.length
    );
    const kaomojis: KaomojiModel[] | null = await getSearchResults(query);
    if (_.isNil(kaomojis)) {
      const err = Error('No kaomoji found for "' + query + '".');
      debug(err);
      slackResponse = {
        text: err.message,
        response_type: "ephemeral",
      };
    } else {
      const selectedOption = action.selected_option;
      slackResponse = createSearchMessage(query, kaomojis, selectedOption);
    }
    res.send({ text: "OK" });
    await respondToInteractiveAction(req, slackResponse);
  }
};
