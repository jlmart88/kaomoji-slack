var mongoose = require('mongoose');

var Kaomoji = new mongoose.Schema({
    text: {type: String},
    keywords: {type: String}
});

Kaomoji.index({keywords: 'text'}, {default_language: 'english'});

module.exports = function(db) {
    return db.model('Kaomoji', Kaomoji);
};