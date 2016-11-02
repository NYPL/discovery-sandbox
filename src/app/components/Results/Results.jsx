import React from 'react';

import EResourceResults from './EResourceResults.jsx';
import ResultList from './ResultsList.jsx';

class Results extends React.Component {
  render() {
    const {
      results,
      hits,
    } = this.props;

    // let pageTotal = (parseInt(hits, 10) <= 10) ? hits : '1-10';
    let pageTotal = hits;

    return (
      <div>
        <div className="results-nav">
          <div className="pagination">
            <span className="pagination-total">{pageTotal} of {hits}</span>
            <a href="#" className="paginate next">Next Page</a>
          </div>

          <div className="sort">
            <form className="sort-form">
              <label htmlFor="sort-by">Sort by</label>
              <select id="sort-by" name="sort">
                <option value="relevance">Relevance</option>
                <option value="title_asc">Title (a - z)</option>
                <option value="title_desc">Title (z - a)</option>
                <option value="author_asc">Author (a - z)</option>
                <option value="author_desc">Author (z - a)</option>
                <option value="date_asc">Date (old to new)</option>
                <option value="date_desc">Date (new to old)</option>
              </select>
            </form>
          </div>
        </div>

        {/*<EResourceResults results={results} query={this.props.query} />*/}
        <ResultList results={results} query={this.props.query} />
      </div>
    );
  }
}

Results.propTypes = {
  results: React.PropTypes.array,
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
};

Results.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Results;
