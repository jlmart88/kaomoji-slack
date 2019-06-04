import KaomojiModel from './index';
import _ from 'lodash';
import sanitize from 'mongo-sanitize';

export default {
  getSearchResults: getSearchResults
};

const MAX_PAGE_LIMIT = 100;

const createSearchQuery = (searchTerms: string | null) => {
  if (!_.isNil(searchTerms)) {
    const sanitizedSearch = sanitize(searchTerms);
    return KaomojiModel.find({
        $text: {
          $search: sanitizedSearch,
        },
      },
      {
        text: 1,
        textScore: {
          $meta: 'textScore',
        },
      },
      {
        sort: {
          textScore: {
            $meta: 'textScore',
          },
        },
      });
  } else {
    return KaomojiModel.find({}, {}, { sort: { text: 1 } });
  }
};

// given an string of search terms, will return a Promise that resolves with a single kaomoji
// if no kaomoji match, will return null
function getSearchResults(searchTerms: string | null, offset: number, limit?: number) {
  const queryPreview = createSearchQuery(searchTerms);

  // first get the count matching this search, to determine how to apply the limit/offset
  // such that the search can wrap back to the beginning when out of results
  return queryPreview.countDocuments().then(count => {
    const queryLimit = _.min([limit, MAX_PAGE_LIMIT]) || MAX_PAGE_LIMIT;
    let query = createSearchQuery(searchTerms).limit(queryLimit);

    // modify the offset to always be valid based on the count
    if (_.isNil(offset)) offset = 0;
    offset = offset % count;
    offset = offset - (offset % queryLimit);
    query = query.skip(offset);

    return query.exec()
      .then(array => {
        console.log('query results', array);
        if (_.isEmpty(array)) return null;

        return array;
      });

  });
}