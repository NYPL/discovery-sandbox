import React from 'react';
import PropTypes from 'prop-types';

import {
  isEmpty as _isEmpty,
  mapObject as _mapObject,
} from 'underscore';

class ResultsCount extends React.Component {
  // The `searchKeywords` prop gets updated before the `count` and we want to wait until both
  // are updated to be read to screen readers. Otherwise, it would read the previous `count`
  // number for the next `searchKeywords`.
  // shouldComponentUpdate(nextProps) {
  //   if (this.props.count !== nextProps.count) {
  //     return true;
  //   }
  //   return false;
  // }
  shouldComponentUpdate(nextProps) {
    return !!!this.props.isLoading;
  }

  /*
   * displayContext()
   * Displays where the results are coming from. This currently only allows for one
   * option at a time due to constraints on the front end not allowing for multiple
   * selections to occur.
   */
  displayContext() {
    const {
      searchKeywords,
      selectedFilters,
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
        if (searchKeywords.indexOf(' ') !== -1) {
          result += `for keywords "${searchKeywords}"`;
        } else {
          result += `for keyword "${searchKeywords}"`;
        }
      }
    }

    if (!_isEmpty(selectedFilters)) {
      _mapObject(selectedFilters, (val, key) => {
        const mappedKey = keyMapping[key];

        if (val && val[0] && val[0].value && mappedKey) {
          result += `for ${mappedKey} "${val[0].value}"`;
        }
      });
    }

    return result;
  }

  /*
   * checkSelectedFilters()
   * Returns true if there are any selected format or language filters. TODO: add Date.
   */
  checkSelectedFilters() {
    const selectedFilters = this.props.selectedFilters;

    if ((selectedFilters.materialType && selectedFilters.materialType.length) ||
      (selectedFilters.language && selectedFilters.language.length)) {
      return true;
    }

    // Eventually need to add check for date.
    return false;
  }

  displayCount() {
    const {
      count,
      isLoading,
      page,
      searchKeywords,
    } = this.props;
    const countF = count ? count.toLocaleString() : '';
    const displayContext = this.displayContext();
    const start = (page - 1) * 50 + 1;
    const end = (page) * 50 > count ? count : (page * 50);
    const currentResultDisplay = `${start}-${end}`;
    const plural = (searchKeywords && searchKeywords.indexOf(' ') !== -1) ? 's' : '';

    if (isLoading) {
      return 'Loading...';
    }

    if (count !== 0) {
      return `Displaying ${currentResultDisplay} of ${countF} results ${displayContext}`;
    }

    if (this.checkSelectedFilters()) {
      return (
        `No results for the keyword${plural} "${searchKeywords}" with the chosen filters. Try a different search or different filters.`
      );
    }

    return `No results for the keyword${plural} "${searchKeywords}". Try a different search.`;
  }

  render() {
    const results = this.displayCount();
    return (
      <div
        className="nypl-results-summary"
      >
        <h2
          id="results-description"
          aria-live="polite"
          aria-atomic="true"
          role="alert"
        >
          {results}
        </h2>
      </div>
    );
  }
}

ResultsCount.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  isLoading: PropTypes.bool,
  selectedFilters: PropTypes.object,
  searchKeywords: PropTypes.string,
  field: PropTypes.string,
};

ResultsCount.defaultProps = {
  searchKeywords: '',
  count: 0,
  isLoading: false,
  page: 1,
  selectedFilters: {
    materialType: [],
    language: [],
    dateAfter: {},
    dateBefore: {},
  },
};

export default ResultsCount;
