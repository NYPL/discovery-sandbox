import React from 'react';

import {
  extend as _extend,
  findWhere as _findWhere,
  pick as _pick,
} from 'underscore';

import Actions from '../../actions/Actions';
import Store from '../../stores/Store';
import {
  ajaxCall,
  getSortQuery,
  getFacetParams,
} from '../../utils/utils';

const facetShowLimit = 4;

class DateFacet extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      spinning: false,
      openFacet: true,
    }, Store.getState());

    this.onChange = this.onChange.bind(this);
    this.routeHandler = this.routeHandler.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);

    setTimeout(() => {
      this.setState({ openFacet: false });
    }, 500);
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState(_extend(this.state, Store.getState()));
  }

  routeHandler(path) {
    if (path === '/') {
      Actions.updateSelectedFacets({});
    }

    this.context.router.push(path);
  }

  render() {
    const spinningClass = this.state.spinning ? 'spinning' : '';

    return (
      <div className={`nypl-facet-search nypl-spinner-field ${this.state.spinning ? 'spinning' : ''}`}>
        <div className="nypl-text-field">
          <label
            key="date-from"
            htmlFor="date-from"
          >On or After Year</label>
          <input
            id={`facet-date-from-search`}
            type="text"
            className="form-text"
            placeholder=""
          />
        </div>
        <div className="nypl-text-field">
          <label
            key="date-to"
            htmlFor="date-to"
          >On or Before Year</label>
          <input
            id={`facet-date-to-search`}
            type="text"
            className="form-text"
            placeholder=""
          />
        </div>
      </div>
    );
  }
}

DateFacet.propTypes = {
  sortBy: React.PropTypes.string,
  totalHits: React.PropTypes.number,
  selectedValue: React.PropTypes.string,
};

DateFacet.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default DateFacet;
