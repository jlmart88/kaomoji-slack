import {
  createListMessage,
  createOptionsList,
} from "@/components/interactions/list/message";
import { respondToInteractiveAction } from "@/components/interactions/utils";
import { KaomojiModel } from "@/models/kaomoji";
import { Option } from "@slack/types";
import Debug from "debug";
import { getSearchResults } from "@/models/kaomoji/service";
import { ResponseMessage } from "@/types/slack";
import _ from "lodash";
import { BlockAction } from "../BlockAction";
import { BlockSuggestion } from "../BlockSuggestion";

const debug = Debug("interactions:list");

export const sendListOptions = async (
  blockSuggestion: BlockSuggestion,
): Promise<{ options: Option[] }> => {
  const query = blockSuggestion.value;
  let optionsResponse: { options: Option[] };
  // this is the initial search request, so respond with a message
  const kaomojis: KaomojiModel[] | null = await getSearchResults(query);
  if (_.isNil(kaomojis)) {
    const err = Error('No kaomoji found for "' + query + '".');
    debug(err);
    optionsResponse = createOptionsList([]);
  } else {
    optionsResponse = createOptionsList(kaomojis);
  }
  return optionsResponse;
};

export const sendListMessage = async (): Promise<ResponseMessage | void> => {
  let slackResponse: ResponseMessage;
  // this is the initial list request, so respond with the select search message
  slackResponse = createListMessage();
  return slackResponse;
};

export const sendFollowUpListMessage = async (blockAction: BlockAction) => {
  let slackResponse: ResponseMessage;
  // this is a follow up interaction, so parse out the selection and send an updated message
  const { actions } = blockAction;
  const action = actions[0];
  const selectedOption = action.selected_option;
  slackResponse = createListMessage(selectedOption);
  await respondToInteractiveAction(blockAction, slackResponse);
  return { text: "OK" };
};
