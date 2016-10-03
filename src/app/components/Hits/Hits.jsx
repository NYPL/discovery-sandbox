import React from 'react';

const Hits = ({ ebscodata, query }) => (
  <div>
    <p>
      {ebscodata.SearchResult &&
       ebscodata.SearchResult.Statistics &&
       ebscodata.SearchResult.Statistics.TotalHits ?
        `Found ${ebscodata.SearchResult.Statistics.TotalHits} results` +
        ` with keywords \"${query}\".` : ''}
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
