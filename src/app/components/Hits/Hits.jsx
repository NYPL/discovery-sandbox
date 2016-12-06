import React from 'react';
import { mapObject as _mapObject } from 'underscore';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

class Hits extends React.Component {
  constructor(props) {
    super(props);

    this.removeFacet = this.removeFacet.bind(this);
    this.getKeyword = this.getKeyword.bind(this);
    this.getFacetElements = this.getFacetElements.bind(this);
  }

  getKeyword(keyword) {
    if (keyword) {
      return (
        <span>with keywords <strong>"{keyword}"</strong>
          <a href="#" onClick={() => this.removeKeyword(keyword)} className="removeKeyword">[x]</a>
        </span>
      );
    }

    return null;
  }

  getFacetElements(facets) {
    if (!facets.length) return null;

    return facets.map((facet, i) => (
      <span key={i}> with {facet.key} [{facet.val.value}]
        <a href="#" onClick={() => this.removeFacet(facet.key)} className="removeFacet">[x]</a>
      </span>
    ));
  }

  removeKeyword() {
    Actions.updateSearchKeywords('');

    let strSearch = '';
    _mapObject(this.props.facets, (val, key) => {
      if (val.value !== '') {
        strSearch += `${key}:"${val.id}" `;
      }
    });

    axios
      .get(`/api?q=${strSearch}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
        Actions.updatePage('1');
        this.context.router.push(`/search?q=${strSearch}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  removeFacet(field) {
    Actions.removeFacet(field);
    let strSearch = '';

    // If the selected field that wants to be removed is found, then it is skipped over.
    // Otherwise, construct the query and hit the API again.
    _mapObject(this.props.facets, (val, key) => {
      if (field !== key && val.value !== '') {
        strSearch += ` ${key}:"${val.id}"`;
      }
    });

    const reset = this.props.sortBy === 'relevance';
    let sortQuery = '';

    if (this.props.sortBy && !reset) {
      const [sortBy, order] = this.props.sortBy.split('_');
      sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
    }

    axios
      .get(`/api?q=${this.props.query}${strSearch}${sortQuery}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
        Actions.updatePage('1');
        this.context.router.push(`/search?q=${this.props.query}${strSearch}${sortQuery}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const {
      facets,
      hits,
      query,
    } = this.props;
    const activeFacetsArray = [];
    const hitsF = hits ? hits.toLocaleString() : '';

    _mapObject(facets, (val, key) => {
      if (val.value) {
        activeFacetsArray.push({ val, key });
      }
    });

    let keyword = this.getKeyword(query);
    let activeFacetsElm = this.getFacetElements(activeFacetsArray);

    return (
      <div className="results-message">
        {
          hits !== 0 ?
          (<p>
            Found <strong>{hitsF}</strong> results {keyword} {activeFacetsElm}.
          </p>)
          : (<p>No results found {keyword} {activeFacetsElm}.</p>)
        }
      </div>
    );
  }
}

Hits.propTypes = {
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
  facets: React.PropTypes.object,
  sortBy: React.PropTypes.string,
};

Hits.defaultProps = {
  hits: 0,
}

Hits.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Hits;
