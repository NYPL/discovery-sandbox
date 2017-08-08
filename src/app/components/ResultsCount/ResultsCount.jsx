import React from 'react';
import PropTypes from 'prop-types';

class ResultsCount extends React.Component {
  displayCount() {
    const { count, spinning } = this.props;
    const countF = count ? count.toLocaleString() : '';

    if (spinning) {
      return (<p>Loading…</p>);
    }

    if (count !== 0) {
      return (<p>{countF} results</p>);
    }
    return (<p>No results found. Please try another search.</p>);
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
};

ResultsCount.defaultProps = {
  count: 0,
  spinning: false,
};

export default ResultsCount;
