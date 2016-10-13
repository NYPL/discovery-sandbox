import React from 'react';

const Hits = ({ hits, query }) => (
  <div className="results-message">
    <p>
      Found <strong>{hits}</strong> results with keywords <strong>"{query}"</strong>.
    </p>
  </div>
);

Hits.propTypes = {
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
};

export default Hits;
