var mongoose = require('mongoose');

var Kaomoji = new mongoose.Schema({
    text: {
        type: String,
        index: true,
        unique: true
    },
    keywords: String
});

Kaomoji.index({keywords: 'text'}, {default_language: 'english'});

module.exports = function(db) {
    return db.model('Kaomoji', Kaomoji);
};