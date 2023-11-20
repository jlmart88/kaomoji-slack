import Debug from "debug";
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
import { Command } from "@/components/interactions/Command";
import { BlockAction } from "../BlockAction";

const debug = Debug("interactions:search");

export const sendSearchMessage = async (
  command: Command,
): Promise<ResponseMessage | void> => {
  const query = command.text ?? "";
  let slackResponse: ResponseMessage;
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
  return slackResponse;
};

export const sendFollowUpSearchMessage = async (blockAction: BlockAction) => {
  let slackResponse: ResponseMessage;
  // this is a follow up interaction, so parse out the selection and send an updated message
  const { actions } = blockAction;
  const action = actions[0];
  const query = action.block_id.slice(
    BLOCK_IDS.KAOMOJI_SEARCH_SELECT.length + BLOCK_ID_PREFIX_DELIMITER.length,
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
  await respondToInteractiveAction(blockAction, slackResponse);
  return { text: "OK" };
};
