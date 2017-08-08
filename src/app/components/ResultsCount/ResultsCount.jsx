import React from 'react';
import PropTypes from 'prop-types';

import {
  isEmpty as _isEmpty,
  mapObject as _mapObject,
} from 'underscore';

class ResultsCount extends React.Component {
  displayContext() {
    const { searchKeywords, selectedFacets } = this.props;
    const keyMapping = {
      creatorLiteral: 'Author',
      contributorLiteral: 'Author',
      titleDisplay: 'Title',
      subjectLiteral: 'Subject',
    };

    let result = '';

    if (searchKeywords) {
      result += `for search keyword ${searchKeywords}`;
    }

    if (!_isEmpty(selectedFacets)) {
      _mapObject(selectedFacets, (val, key) => {
        const mappedKey = keyMapping[key];

        if (val[0] && val[0].value) {
          result += `for ${mappedKey} ${val[0].value}`;
        }
      });
    } else {
      result += '.';
    }

    return result;
  }

  displayCount() {
    const { count, spinning } = this.props;
    const countF = count ? count.toLocaleString() : '';
    const displayContext = this.displayContext();

    if (spinning) {
      return (<p>Loading…</p>);
    }

    if (count !== 0) {
      return (<p>{countF} results {displayContext}</p>);
    }
    return (<p>No results found.</p>);
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
  spinning: PropTypes.bool,
  selectedFacets: PropTypes.object,
  searchKeywords: PropTypes.string,
};

ResultsCount.defaultProps = {
  count: 0,
  spinning: false,
};

export default ResultsCount;
