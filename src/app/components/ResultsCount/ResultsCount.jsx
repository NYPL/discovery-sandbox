import React from 'react';
import PropTypes from 'prop-types';

import Store from '@Store'

class ResultsCount extends React.Component {
  // The `searchKeywords` prop gets updated before the `count` and we want to wait until both
  // are updated to be read to screen readers. Otherwise, it would read the previous `count`
  // number for the next `searchKeywords`.
  shouldComponentUpdate() {
    return !Store.state.isLoading;
  }

  /*
   * displayContext()
   * Displays where the results are coming from. This currently only allows for one
   * option at a time due to constraints on the front end not allowing for multiple
   * selections to occur.
   *
   * @returns {string} A phrase like "for (keyword|title|author) TERM"
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
      standard_number: 'standard number',
    };

    // Build up an array of human-readable "clauses" representing the query:
    const clauses = [];

    // Build a hash of active, non-empty filters:
    const activeFilters = Object.keys((selectedFilters || {}))
      .reduce((map, key) => {
        const label = keyMapping[key];
        const filter = selectedFilters[key];
        if (label
          && Array.isArray(filter)
          && filter[0]
          && filter[0].value
        ) {
          return Object.assign({ [label]: selectedFilters[key][0].value }, map);
        }
        return map;
      }, {});

    // Are there any filters at work?
    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    // If there are filters, build a clause like 'author "Shakespeare", title "Hamlet"'
    if (hasActiveFilters) {
      clauses.push(
        Object.keys(activeFilters)
          .map(label => `${label} "${activeFilters[label]}"`)
          .join(', '),
      );
    }

    // Mention keywords if keywords used (or no results):
    if (searchKeywords || this.props.count === 0) {
      // We call `q` something different depending on search_scope (i.e.
      // "field") and the number of results.

      // By default, call it 'keywords':
      const plural = /\s/.test(searchKeywords) ? 's' : '';
      let fieldLabel = `keyword${plural}`;
      // Special case 1: If 0 results, call it "the keywords":
      if (this.props.count === 0) {
        fieldLabel = `the ${fieldLabel}`;
      }
      // Special case 2: if a search_scope used, use a friendly name for that:
      if (field && field !== 'all') {
        fieldLabel = keyMapping[field];
      }
      clauses.push(`${fieldLabel} "${searchKeywords}"`);
    }

    // Now join the accumlated (0-2) "clauses" together into a phrase like:
    // 'for author "Shakespeare" and keywords "romeo and juliet"'
    return clauses.length ? `for ${clauses.join(' and ')}` : '';
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
      page,
    } = this.props;
    const countF = count ? count.toLocaleString() : '';
    const start = ((page - 1) * 50) + 1;
    const end = (page) * 50 > count ? count : (page * 50);
    const currentResultDisplay = `${start}-${end}`;

    if (Store.state.isLoading) {
      return 'Loading...';
    }

    if (count !== 0) {
      return `Displaying ${currentResultDisplay} of ${countF} results ${this.displayContext()}`;
    }

    if (this.checkSelectedFilters()) {
      return `No results ${this.displayContext()} with the chosen filters. Try a different search or different filters.`;
    }

    return `No results ${this.displayContext()}. Try a different search.`;
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
  selectedFilters: PropTypes.object,
  searchKeywords: PropTypes.string,
  field: PropTypes.string,
};

ResultsCount.defaultProps = {
  searchKeywords: '',
  count: 0,
  page: 1,
  selectedFilters: {
    materialType: [],
    language: [],
    dateAfter: {},
    dateBefore: {},
  },
};

export default ResultsCount;
