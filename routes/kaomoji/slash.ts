import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import kaomojiCommands from 'kaomoji/components/commands';
import { sendSearchMessage } from 'kaomoji/components/interactions/search';
import { sendShortcutsMessage } from 'kaomoji/components/interactions/shortcut';
import listInteractions from 'kaomoji/components/interactions/list';


/* POST kaomoji-search. */
router.post('/', (req, res) => {
  console.log('slash', req.body);
  const query = req.body.text;
  if (kaomojiCommands.isCommandQuery(query)) {
    return _performCommand(req, res, query);
  } else {
    return sendSearchMessage(req, res, query);
  }
});

function _performCommand(req: Request, res: Response, query: string) {
  console.log('performing command', query);
  let response = {};

  switch (query) {
    case kaomojiCommands.COMMAND_LIST.EMPTY:
    case kaomojiCommands.COMMAND_LIST.SHORTCUTS:
      return sendShortcutsMessage(req, res);
    case kaomojiCommands.COMMAND_LIST.LIST:
      return listInteractions.sendListMessage(req, res);
    case kaomojiCommands.COMMAND_LIST.HELP:
      response = _composeEphemeralMessage(kaomojiCommands.getHelpText());
      break;
    default:
      response = _composeEphemeralMessage(kaomojiCommands.getDefaultText(query));
      break;
  }
  console.log('command response', response);
  return res.send(response);
}

function _composeEphemeralMessage(message: string) {
  return {
    text: message,
    response_type: 'ephemeral'
  };
}

export default router;
