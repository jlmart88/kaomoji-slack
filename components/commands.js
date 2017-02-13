var KaomojiModel = require('../models/kaomoji');
var _ = require('lodash');

var KAOMOJI_SLASH = '/kaomoji';

var COMMAND_PREFIX = ':';

var COMMAND_LIST = {
    HELP: COMMAND_PREFIX + 'help',
    SHORTCUTS: COMMAND_PREFIX + 'shortcuts',
    EMPTY: '',
    LIST: COMMAND_PREFIX + 'list',
}

module.exports = {
    COMMAND_LIST: COMMAND_LIST,
    isCommandQuery: isCommandQuery,
    getShortcutsUsageText: getShortcutsUsageText,
    getHelpText: getHelpText,
    getDefaultText: getDefaultText,
    getNoUserTokenText: getNoUserTokenText
};

function isCommandQuery(query) {
    return (query[0] === COMMAND_PREFIX || query === COMMAND_LIST.EMPTY);
}

function getShortcutsUsageText() {
    return 'Type `' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.SHORTCUTS + '` or `' + KAOMOJI_SLASH + '` to display all shortcuts you have set.';
}

function getHelpText() {
    var helpText = '' + 
        '`' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.HELP + '` - displays this text' + '\n' +
        '`' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.SHORTCUTS + '` or `' + KAOMOJI_SLASH + '` - displays all shortcuts you have set' + '\n' +
        '`' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.LIST + '` - displays all kaomojis in the database' + '\n' +
        '';
    return helpText;
}

function getDefaultText(invalidCommand) {
    var defaultText = '' +
        '"' + invalidCommand + '" is invalid. Please type ' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.HELP + ' for a list of valid commands.';
    return defaultText;
}

function getNoUserTokenText() {
    return 'You must <http://12a14799.ngrok.io/oauth/signin|Sign in with Slack> to use the ' + KAOMOJI_SLASH + ' slash command.';
}