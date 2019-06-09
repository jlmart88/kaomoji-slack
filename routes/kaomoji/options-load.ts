import express from 'express';
import { ACTION_IDS } from 'kaomoji/components/interactions/constants';
import { sendListOptions } from 'kaomoji/components/interactions/list';
const router = express.Router();

/* POST kaomoji-search. */
router.post('/', (req, res) => {
  console.log('options-load', req.payload);
  if (req.payload.type == 'block_suggestion') {
    switch (req.payload.action_id) {
      case ACTION_IDS.SELECT_KAOMOJI:
        return sendListOptions(req, res);
    }
  }
});


export default router;
