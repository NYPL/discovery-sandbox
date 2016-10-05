import React from 'react';

const Hits = ({ ebscodata, query }) => (
  <div className="results-message">
    <p>
      {
        ebscodata.SearchResult &&
        ebscodata.SearchResult.Statistics &&
        ebscodata.SearchResult.Statistics.TotalHits ?
        (
          <span>Found <strong>{ebscodata.SearchResult.Statistics.TotalHits}</strong> results
          with keywords <strong>"{query}"</strong>.</span>
        )
        : ''
      }
    </p>
  </div>
);

// <div>
//   Found results in the following databases
//   <ul>
//     {
//       ebscodata.SearchResult.Statistics.Databases ?
//       ebscodata.SearchResult.Statistics.Databases.map((d, i) => {
//         return <li key={i}>{d.Label}</li>;
//       })
//       : null
//     }
//   </ul>
// </div>

Hits.propTypes = {
  ebscodata: React.PropTypes.object,
  query: React.PropTypes.string,
};

export default Hits;
