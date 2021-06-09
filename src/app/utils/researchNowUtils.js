/* eslint-disable camelcase */

const mapSearchScope = {
  all: 'keyword',
  contributor: 'author',
  standard_number: 'standardNumber',
  title: 'title',
  date: 'date',
};

/**
 *  Given a hash of RC filter params including:
 *   - `dateAfter`
 *   - `dateBefore`
 *   - `language`
 *
 *  Returns a hash representing an equivalent `filter` param on DRBAPI
 */

const mapFilters = (filters = {}) => {
  let researchNowFilters = [];

  if (filters.dateAfter) researchNowFilters.push(`startYear:${filters.dateAfter}`)
  if (filters.dateBefore) researchNowFilters.push(`endYear:${filters.dateBefore}`)
  if (filters.language) {
    researchNowFilters = researchNowFilters.concat(
      (Array.isArray(filters.language) ? filters.language : [ filters.language ])
       .map(lang => lang.replace('lang:', 'language:'))
    )
  }

  return researchNowFilters;
};

/**
 *  Given a hash of RC params including:
 *   - `q`
 *   - `field`
 *   - `filters`, including:
 *     - `dateAfter`
 *     - `dateBefore`
 *     - `contributorLiteral`
 *     - `subjectLiteral`
 *     - `language`
 *
 *  Returns a hash representing an equivalent query against DRBAPI
 */
const createResearchNowQuery = (params) => {
  const {
    q,
    sort,
    sort_direction,
    filters,
    field,
    per_page,
  } = params;

  const mainQuery = [
    mapSearchScope[field] || 'keyword',
    q || '*'
  ].join(':')

  const query = {
    query: [ mainQuery ],
    page: 1,
  };

  if (sort) {
    sort_direction = sort_direction || (sort === 'date' ? 'desc' : 'asc')
    query.sort = [sort, sort_direction].join(':');
  }

  if (per_page) query.size = per_page;

  const {
    subjectLiteral,
    contributorLiteral,
    language,
    dateAfter,
    dateBefore,
  } = filters || {};

  // DRB doesn't handle subject or contributor in `filter` param, so handle
  // them separately:
  if (subjectLiteral) {
    query.query = query.query.concat(
      (Array.isArray(subjectLiteral) ? subjectLiteral : [ subjectLiteral ])
      .map(subject => [ 'subject', subject ].join(':'))
    )
  }
  if (contributorLiteral) query.query.push(['author', contributorLiteral].join(':'));

  // Extract language and date filters for drb `filter` param:
  if (language || dateAfter || dateBefore) {
    query.filter = mapFilters({ dateAfter, dateBefore, language });
  }

  return query;
};

const getAuthorIdentifier = author => (author.viaf && ['viaf', 'viaf']) || (author.lcnaf && ['lcnaf', 'lcnaf']) || ['name', 'author'];

const authorQuery = author => ({
  // FIXME: This is V3 semantics; needs to return something akin to https://digital-research-books-beta.nypl.org/search?query=author%3AZangerle%2C+John+A.+%28%29
  queries: JSON.stringify([{
    query: author[getAuthorIdentifier(author)[0]],
    field: getAuthorIdentifier(author)[1],
  }]),
  showQueries: JSON.stringify([{ query: author.name, field: 'author' }]),
});

const formatUrl = link => (link.startsWith('http') ? link : `https://${link}`);

const generateStreamedReaderUrl = (url, eReaderUrl) => {
  const base64BookUrl = Buffer.from(formatUrl(url)).toString('base64');
  const encodedBookUrl = encodeURIComponent(`${base64BookUrl}`);

  return encodeURI(`${eReaderUrl}/readerNYPL/?url=${eReaderUrl}/pub/${encodedBookUrl}/manifest.json`);
};

/**
 *  Given a hash representation of a query string, e.g.
 *    {
 *      query: [ 'keyword:toast', 'subject:snacks' ],
 *      page: 1
 *    }
 *
 *  ..returns a URI encoded query string representation of the values, e.g.
 *    "query=keyword:toast,subject:snacks&page=1"
 */
const getQueryString = (query) => {
  return '?' + (query && Object.keys(query)
    .reduce((pairs, key) => {
      // Get array of values for this key
      let values = query[key]
      if (!Array.isArray(values)) values = [ values ]
      values = values.map(encodeURIComponent)
      return pairs.concat(
        // Join values with ','
        [encodeURIComponent(key), values.join(',')].join('=')
      )
    }, [])
    .join('&')
  );
};

/**
 *
 * Given a hash representing an RC query string
 *
 * returns a URI encoded string representation of the query string
 * suitable for DRBB
 */
const getResearchNowQueryString = query => getQueryString(createResearchNowQuery(query));

export {
  createResearchNowQuery,
  authorQuery,
  generateStreamedReaderUrl,
  formatUrl,
  getResearchNowQueryString,
  getQueryString,
};
