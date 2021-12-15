import { createShortcutsMessage } from 'kaomoji/components/interactions/shortcut/message';
import { respondToInteractiveAction } from 'kaomoji/components/interactions/utils';
import { Button } from '@slack/types';
import { Request, Response } from 'express';
import Debug from 'debug';
import { ResponseMessage } from 'kaomoji/types/slack';

import shortcut, { hasUserExceededShortcutLimit, MAX_SHORTCUTS_PER_USER } from 'kaomoji/models/shortcut/service';
import kaomojiCommands from 'kaomoji/components/commands';

const debug = Debug('interactions:search');

export const saveShortcut = async (req: Request, res: Response, kaomoji?: string) => {
  let message: ResponseMessage;
  if (!kaomoji) {
    message = {
      text: 'An unknown error occurred while creating your kaomoji shortcut.',
      response_type: 'ephemeral',
      replace_original: false,
    };
    respondToInteractiveAction(req, message);
    return res.send({ text: message.text });
  }

  const hasExceeded = await hasUserExceededShortcutLimit(req.user);
  if (hasExceeded) {
    message = {
      text: 'You have reached the shortcut limit of ' + MAX_SHORTCUTS_PER_USER + ', remove one to add ' + kaomoji + ' as a shortcut.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
      response_type: 'ephemeral',
      replace_original: false,
    };
    respondToInteractiveAction(req,message);
    return res.send({ text: message.text });
  }

  try {
    await shortcut.createShortcut(req.user, kaomoji);
    message = {
      text: 'A kaomoji shortcut for ' + kaomoji + ' has been created.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
      response_type: 'ephemeral',
      replace_original: false,
    };
  } catch (err) {
    if (err?.code === 11000) {
      message = {
        text: 'A kaomoji shortcut for ' + kaomoji + ' already exists.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
        response_type: 'ephemeral',
        replace_original: false,
      };
    } else {
      message = {
        text: 'An unknown error occurred while creating your kaomoji shortcut.',
        response_type: 'ephemeral',
        replace_original: false,
      };
    }
  }
  respondToInteractiveAction(req, message);
  return res.send({ text: message.text });
};

export const sendShortcutsMessage = async (req: Request, res: Response, shouldResetSelection?: boolean): Promise<Response | void> => {
  let slackResponse: ResponseMessage;
  const { payload } = req;
  const isInitialRequest = !payload;
  console.log('isInitialRequest', isInitialRequest);
  console.log('payload', payload);
  try {
    const shortcuts = await shortcut.getShortcutsForUser(req.user);
    if (isInitialRequest) {
      // this is the initial shortcuts request
      slackResponse = createShortcutsMessage(shortcuts);
    } else {
      // this is a follow up interaction, so parse out the selection and send an updated message
      let selectedOption;
      if (!shouldResetSelection) {
        const { actions } = payload;
        const action = actions[0];
        selectedOption = action.selected_option;
      }
      slackResponse = createShortcutsMessage(shortcuts, selectedOption);
    }
  } catch (err) {
    debug(err);
    slackResponse = {
      text: err?.message,
      response_type: 'ephemeral'
    };
  }
  if (isInitialRequest) {
    return res.send(slackResponse);
  } else {
    res.send({ text: 'OK' });
    await respondToInteractiveAction(req, slackResponse);
  }
};

export const removeShortcut = async (req: Request, res: Response) => {
  const { payload } = req;
  const { actions } = payload;
  const action: Button = actions[0];
  let slackResponse: ResponseMessage;
  try {
    await shortcut.removeShortcut(action.value);
    await sendShortcutsMessage(req, res, true);
  } catch (err) {
    debug(err);
    slackResponse = {
      text: err?.message,
      response_type: 'ephemeral'
    };
    res.send({ text: 'OK' });
    await respondToInteractiveAction(req, slackResponse);
  }
};
