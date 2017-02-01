module.exports = function(app) {
    if (app.get('env') == 'development') {
        return require('./dev');
    } else if (app.get('env') == 'production') {
        return require('./prod');
    }
};
