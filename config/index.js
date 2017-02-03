var _ = require('lodash')

module.exports = function(app) {
    var config = require('./base');

    if (app.get('env') == 'development') {
        _.extend(config, require('./dev'));
    } else if (app.get('env') == 'production') {
        _.extend(config, require('./prod'));
    }

    return config;
};
