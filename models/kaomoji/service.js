var KaomojiModel = require('.');
var _ = require('lodash');

module.exports = {
  getSearchResults: getSearchResults
};

var MAX_PAGE_LIMIT = 10;

// given an string of search terms, will return a Promise that resolves with a single kaomoji
// if no kaomoji match, will return null
function getSearchResults(db, searchTerms, offset, limit) {
  var Kaomoji = KaomojiModel(db);

  var queryPromise;
  if (!_.isNil(searchTerms)) {
    queryPromise = Kaomoji.collection.find({
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
      });
  } else {
    queryPromise = Kaomoji.collection.find({}, {}, {sort: {text: 1}});
  }

  return queryPromise.count().then(count => {
    if (_.isNil(limit)) limit = MAX_PAGE_LIMIT;
    limit = _.min([limit, MAX_PAGE_LIMIT]);
    queryPromise = queryPromise.limit(limit);

    if (_.isNil(offset)) offset = 0;
    offset = offset % count;
    offset = offset - (offset % limit);
    queryPromise = queryPromise.skip(offset);


    return queryPromise.toArray()
      .then(array => {
        console.log('query results', array);
        if (_.isEmpty(array)) return null;

        return array;
      });

  });
}