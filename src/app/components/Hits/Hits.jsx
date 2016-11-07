import React from 'react';
import { mapObject as _mapObject } from 'underscore';

const Hits = ({ hits, query, facets }) => {
  let filterString = '';

  _mapObject(facets, (val, key) => {
    if (val.value) {
      filterString += ` with ${key} [${val.value}][x]`;
    }
  });

  return (
    <div className="results-message">
      <p>
        Found <strong>{hits}</strong> results with keywords <strong>"{query}"</strong>
        {filterString}.
      </p>
    </div>
  );
};

Hits.propTypes = {
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
};

export default Hits;
