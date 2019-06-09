const KAOMOJI_SLASH = '/kaomoji';

const COMMAND_PREFIX = '!';

const COMMAND_LIST = {
  HELP: COMMAND_PREFIX + 'help',
  SHORTCUTS: COMMAND_PREFIX + 'shortcuts',
  EMPTY: '',
  LIST: COMMAND_PREFIX + 'list',
}

export default {
  COMMAND_LIST: COMMAND_LIST,
  isCommandQuery: isCommandQuery,
  getShortcutsUsageText: getShortcutsUsageText,
  getHelpText: getHelpText,
  getDefaultText: getDefaultText,
  getNoUserTokenText: getNoUserTokenText
};

function isCommandQuery(query: string) {
  return (query[0] === COMMAND_PREFIX || query === COMMAND_LIST.EMPTY);
}

function getShortcutsUsageText() {
  return 'Type `' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.SHORTCUTS + '` or `' + KAOMOJI_SLASH + '` to display/manage your shortcuts.';
}

function getHelpText() {
  const helpText = '' +
    '`' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.HELP + '` - displays this text' + '\n' +
    '`' + KAOMOJI_SLASH + ' table` - returns a list of kaomojis matching the search "table"' + '\n' +
    '`' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.SHORTCUTS + '` or `' + KAOMOJI_SLASH + '` - allows you to send/manage your shortcuts' + '\n' +
    '`' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.LIST + '` - opens a search over all available kaomojis' + '\n' +
    '';
  return helpText;
}

function getDefaultText(invalidCommand: string) {
  const defaultText = '' +
    '"' + invalidCommand + '" is invalid. Please type ' + KAOMOJI_SLASH + ' ' + COMMAND_LIST.HELP + ' for a list of valid commands.';
  return defaultText;
}

function getNoUserTokenText(serverUrl: string) {
  return 'You must <' + serverUrl + '/oauth/signin|Sign in with Slack> to use the ' + KAOMOJI_SLASH + ' slash command. ' +
    'If this is not working for you, check our <' + serverUrl + '/faq|FAQ> for further help.';
}