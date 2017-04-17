import React from 'react';

import Actions from '../../actions/Actions.js';
import {
  ajaxCall,
  getSortQuery,
  getFacetParams,
} from '../../utils/utils.js';

import {
  findWhere as _findWhere,
} from 'underscore';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.props.facets.map(facet => {
      let id = '';
      let value = '';

      if (this.props.selectedFacets && this.props.selectedFacets[facet.field]) {
        id = this.props.selectedFacets[facet.field].id;
        value = this.props.selectedFacets[facet.field].value;
      }

      this.state[facet.field] = { id, value };
    });

    this.routeHandler = this.routeHandler.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, field) {
    const value = e.target.value;
    let strSearch = '';

    if (value === `${field}_any`) {
      this.setState({
        [field]: {
          id: '',
          value: '',
        },
      });
    } else {
      const searchValue = field === 'date' ? parseInt(value, 10) : value;
      const facetObj = _findWhere(this.props.facets, { field });
      const facet = _findWhere(facetObj.values, { value: searchValue });

      this.setState({
        [field]: {
          id: facet.value,
          value: facet.label || facet.value,
        },
      });
    }

    strSearch = getFacetParams(this.state, field, value);

    const sortQuery = getSortQuery(this.props.sortBy);

    ajaxCall(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updateSelectedFacets(this.state);
      Actions.updatePage('1');
      this.routeHandler(
        null,
        `/search?q=${encodeURIComponent(this.props.keywords)}${strSearch}${sortQuery}`
      );
    });
  }

  removeKeyword() {
    Actions.updateSearchKeywords('');

    const strSearch = getFacetParams(this.props.selectedFacets);
    const sortQuery = getSortQuery(this.props.sortBy);

    ajaxCall(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      this.context.router.push(`/search?q=${this.props.keywords}${strSearch}${sortQuery}`);
    });
  }

  routeHandler(e, path) {
    if (e) e.preventDefault();

    if (path === '/') {
      Actions.updateSelectedFacets({});
    }

    this.context.router.push(path);
  }

  render() {
    const { facets } = this.props;
    let facetsElm = null;

    if (facets.length) {
      facetsElm = facets.map((facet, i) => {
        const field = facet.field;

        if (facet.values.length < 1 || field === 'carrierType' || field === 'mediaType') {
          return null;
        }

        const selectedValue = this.state[field] ? this.state[field].id : '';

        return (
          <div className="nypl-searchable-field">
            <div className="nypl-facet-search">
              <label htmlFor="{`${facet.field}-${f.value}`}">{facet.field}</label>
              <input id="{`${facet.field}-${f.value}`}" type="text" placeholder={`Search ${facet.field} Types`} />
            </div>
            <div className="nypl-facet-list">
            {
              facet.values.map((f, j) => {
                return (
                  <label htmlFor={`${facet.field}-${f.value}`} className={`nypl-bar_${f.count}`}>
                    <input id={`${facet.field}-${f.value}`} type="checkbox" name="subject" value={`${f.value}`} />
                    <span>
                      {f.value}
                    </span>
                    <span className="nypl-facet-count">{f.count}</span>
                  </label>
                );
              })
            }
            </div>
          </div>
        );
      });
    }

    return (
      <form className="nypl-search-form">
        <div className={`facets ${this.props.className} `}>
          <div className="nypl-facet-search">
          {facetsElm}
          </div>
        </div>
      </form>
    );
  }
}

FacetSidebar.propTypes = {
  facets: React.PropTypes.array,
  keywords: React.PropTypes.string,
  selectedFacets: React.PropTypes.object,
  sortBy: React.PropTypes.string,
  className: React.PropTypes.string,
};

FacetSidebar.defaultProps = {
  className: '',
};

FacetSidebar.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default FacetSidebar;
