import { ResponseMessage } from "@/types/slack";
import { BlockAction } from "./BlockAction";

export const respondToInteractiveAction = async (
  blockAction: BlockAction,
  message: Partial<ResponseMessage>,
) => {
  const url = blockAction.response_url;
  await fetch(url, {
    body: JSON.stringify(message),
    method: "POST",
  });
  return { text: "Responded to Interactive Action" };
};

export const cancelInteractiveMessage = async (blockAction: BlockAction) => {
  const slackResponse: Partial<ResponseMessage> = {
    delete_original: true,
  };
  await respondToInteractiveAction(blockAction, slackResponse);
  return { text: "Cancelled Interactive Message" };
};
