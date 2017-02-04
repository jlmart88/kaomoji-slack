var KaomojiModel = require('../models/kaomoji');
var _ = require('lodash');

var KAOMOJI_SLASH = '/kaomoji'

var COMMAND_LIST = {
    HELP: ':help',
    SHORTCUTS: ':shortcuts',
    LIST: ':list',
}

module.exports = {
    COMMAND_LIST: COMMAND_LIST,
    getHelpText: getHelpText,
    getDefaultText: getDefaultText,
    getNoUserTokenText: getNoUserTokenText
};

function getHelpText() {
    var helpText = '' + 
        '*' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.HELP + '* - displays this text' + '\n' +
        '*' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.SHORTCUTS + '* - displays all shortcuts you have set' + '\n' +
        '*' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.LIST + '* - displays all kaomojis in the database' + '\n' +
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