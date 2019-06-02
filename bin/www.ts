#!/usr/bin/env node
import debuglib from 'debug';
const debug = debuglib('kaomoji-slack');
import app from 'kaomoji/app';

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
  debug('Express server listening on port ' + app.get('port'));
});
