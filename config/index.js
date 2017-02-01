module.exports = function(app) {
    if (app.get('env') == 'development') {
        return require('./dev');
    }
};
