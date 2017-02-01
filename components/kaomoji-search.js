var KaomojiModel = require('../models/kaomoji');

module.exports = {
    kaomojiSearch: kaomojiSearch
};

// given an string of search terms, will return a Promise that resolves with list of kaomoji sorted by relevance
function kaomojiSearch(db, searchTerms) {
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
    ).toArray();
}