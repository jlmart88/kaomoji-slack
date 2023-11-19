import { Request, Response } from "express";
import { ResponseMessage } from "@/types/slack";
import request from "request";

export const respondToInteractiveAction = (
  req: Request,
  message: Partial<ResponseMessage>,
) => {
  const { response_url: url } = req.payload;
  return request({
    url,
    body: message,
    json: true,
    method: "POST",
  });
};

export const cancelInteractiveMessage = (req: Request, res?: Response) => {
  const slackResponse: Partial<ResponseMessage> = {
    delete_original: true,
  };
  res && res.send({ text: "Cancelling message" });
  return respondToInteractiveAction(req, slackResponse);
};
