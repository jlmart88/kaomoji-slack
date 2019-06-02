import express from 'express';
import { Request, Response } from 'kaomoji/node_modules/@types/express';
var router = express.Router();

import kaomojiCommands from 'kaomoji/components/commands';
import searchInteractions from 'kaomoji/components/interactions/search';
import shortcutInteractions from 'kaomoji/components/interactions/shortcut';
import listInteractions from 'kaomoji/components/interactions/list';


/* POST kaomoji-search. */
router.post('/', (req, res) => {
  console.log('slash', req.body);
  var query = req.body.text;
  if (kaomojiCommands.isCommandQuery(query)) {
    return _performCommand(req, res, query);
  } else {
    return searchInteractions.sendSearchMessage(req, res, query);
  }
});

function _performCommand(req: Request, res: Response, query: string) {
  console.log('performing command', query);
  var response = '';

  switch (query) {
    case kaomojiCommands.COMMAND_LIST.EMPTY:
    case kaomojiCommands.COMMAND_LIST.SHORTCUTS:
      return shortcutInteractions.sendShortcutsMessage(req, res);
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
