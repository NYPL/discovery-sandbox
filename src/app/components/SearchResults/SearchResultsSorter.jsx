import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  trackDiscovery,
} from '../../utils/utils';
import appConfig from '../../data/appConfig';

const sortingOpts = [
  { val: 'relevance', label: 'relevance' },
  { val: 'title_asc', label: 'title (a - z)' },
  { val: 'title_desc', label: 'title (z - a)' },
  { val: 'date_asc', label: 'date (old to new)' },
  { val: 'date_desc', label: 'date (new to old)' },
];

class SearchResultsSorter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortValue: this.props.sortBy || 'relevance',
      js: false,
    };

    this.updateSortValue = this.updateSortValue.bind(this);
  }

  componentDidMount() {
    if (!this.state.js) {
      this.setState({
        js: true,
      });
    }
  }

  /**
   * updateSortValue(e)
   * The fuction listens to the event of changing the input of sort options.
   * It then sets the state with the callback function of making a new search.
   *
   * @param {Event} e
   */
  updateSortValue(e) {
    e.preventDefault();
    const value = e.target.value;

    this.setState({ sortValue: value }, () => this.sortResultsBy(this.state.sortValue));
  }

  /**
   * sortResultsBy(sortBy)
   * The fuction that makes a new search based on the passed sort option.
   *
   * @param {String} sortBy
   */
  sortResultsBy(sortBy) {
    // const apiQuery = this.props.createAPIQuery({ sortBy, page: this.props.page });
    const apiQuery = this.props.createAPIQuery({ sortBy });
    trackDiscovery('Sort by', sortBy);
    this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
  }

  /**
   * renderResultsSort()
   * The fuction that renders the sort options.
   *
   * @return {HTML Element}
   */
  renderResultsSort() {
    return sortingOpts.map(d => (
      <option value={d.val} key={d.val}>
        {d.label}
      </option>
    ));
  }

  render() {
    const {
      searchKeywords,
      field,
    } = this.props;
    const {
      sortValue,
    } = this.state;

    return (
      <div className="nypl-results-sorting-controls">
        <div className="nypl-results-sorter">
          <div className="nypl-select-field-results">
            <label htmlFor="sort-by-label">Sort by</label>
            <form
              action={
                `${appConfig.baseUrl}/search${searchKeywords ? `?q=${searchKeywords}` : ''}` +
                `${field ? `&search_scope=${field}` : ''}`
              }
              method="POST"
            >
              <span className="nypl-omni-fields">
                <strong>
                  <select
                    id="sort-by-label"
                    onChange={this.updateSortValue}
                    value={sortValue}
                    name="sort_scope"
                  >
                    {this.renderResultsSort()}
                  </select>
                </strong>
              </span>
              {!this.state.js && <input type="submit" />}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

SearchResultsSorter.propTypes = {
  sortBy: PropTypes.string,
  searchKeywords: PropTypes.string,
  field: PropTypes.string,
  createAPIQuery: PropTypes.func,
};

SearchResultsSorter.defaultProps = {
  searchKeywords: '',
  field: 'all',
};

SearchResultsSorter.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = state => ({
  sortBy: state.sortBy,
  searchKeywords: state.searchKeywords,
  field: state.field,
});

export default connect(mapStateToProps)(SearchResultsSorter);
