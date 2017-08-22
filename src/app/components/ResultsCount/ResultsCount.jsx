import React from 'react';
import PropTypes from 'prop-types';

import {
  isEmpty as _isEmpty,
  mapObject as _mapObject,
} from 'underscore';

class ResultsCount extends React.Component {
  /*
   * displayContext()
   * Displays where the results are coming from. This currently only allows for one
   * option at a time due to constraints on the front end not allowing for multiple
   * selections to occur.
   */
  displayContext() {
    const {
      searchKeywords,
      selectedFacets,
      field,
    } = this.props;
    const keyMapping = {
      // Currently from links on the bib page:
      creatorLiteral: 'author',
      contributorLiteral: 'author',
      subjectLiteral: 'subject',
      titleDisplay: 'title',
      // From the search field dropdown:
      contributor: 'author/contributor',
      title: 'title',
    };
    let result = '';

    if (searchKeywords) {
      if (field && field !== 'all') {
        result += `for ${keyMapping[field]} "${searchKeywords}"`;
      } else {
        result += `for keyword "${searchKeywords}"`;
      }
    }

    if (!_isEmpty(selectedFacets)) {
      _mapObject(selectedFacets, (val, key) => {
        const mappedKey = keyMapping[key];

        if (val[0] && val[0].value) {
          result += `for ${mappedKey} "${val[0].value}"`;
        }
      });
    }

    return result;
  }

  displayCount() {
    const { count, isDiscoverying, page } = this.props;
    const countF = count ? count.toLocaleString() : '';
    const displayContext = this.displayContext();
    const start = (page - 1) * 50 + 1;
    const end = (page) * 50 > count ? count : (page * 50);
    const currentResultDisplay = `${start}-${end}`;

    if (isDiscoverying) {
      return (<p>Loading…</p>);
    }

    if (count !== 0) {
      return (<h2>Displaying {currentResultDisplay} of {countF} results {displayContext}</h2>);
    }
    return (<h2>No results found. Please try another search.</h2>);
  }

  render() {
    const results = this.displayCount();

    return (
      <div
        id="results-description"
        className="nypl-results-summary"
        aria-live="assertive"
        aria-atomic="true"
        role="presentation"
      >
        {results}
      </div>
    );
  }
}

ResultsCount.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  isDiscoverying: PropTypes.bool,
  selectedFacets: PropTypes.object,
  searchKeywords: PropTypes.string,
  field: PropTypes.string,
};

ResultsCount.defaultProps = {
  count: 0,
  isDiscoverying: false,
  page: 1,
};

export default ResultsCount;
