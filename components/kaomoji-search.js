var KaomojiModel = require('../models/kaomoji');
var _ = require('lodash');

module.exports = {
    kaomojiSearch: kaomojiSearch
};

// given an string of search terms, will return a Promise that resolves with a single kaomoji
// if no kaomoji match, will return null
function kaomojiSearch(db, searchTerms, offset) {
    var Kaomoji = KaomojiModel(db);
    
    return Kaomoji.collection.find(
        {
            $text: {
                $search: searchTerms
            }
        },
        {
            text: 1,
            textScore: {
                $meta: 'textScore'
            }
        },
        {
            sort: {
                textScore: {
                    $meta: 'textScore'
                }
            }
        }
    )
    .toArray()
    .then(array => {
        if (_.isEmpty(array)) return null;
        if (_.isNil(offset)) offset = 0;
        offset = offset % array.length;
        return array[offset];
    });
}