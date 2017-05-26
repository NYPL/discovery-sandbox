import React from 'react';
import { extend as _extend } from 'underscore';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

const FACETSHOWLIMIT = 4;

class Facet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spinning: false,
      openFacet: true,
      facet: { id: '', value: '' },
      showMoreFacets: false,
    };

    this.routeHandler = this.routeHandler.bind(this);
    this.onFacetUpdate = this.onFacetUpdate.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ openFacet: false });
    }, 500);
  }

  onFacetUpdate(e) {
    Actions.updateSpinner(true);
    // In order for this to work, the facet object is passed as a stringified JSON string.
    // That way we get the whole clicked facet and then there's no need to search for it.
    const clickedFacet = JSON.parse(e.target.value);
    const checked = e.target.checked;
    const pickedFacet = {};
    let selectedFacets = {};
    let selectedFacetObj = {};

    // If the clicked facet is unchecked, make its selection empty.
    if (!checked) {
      selectedFacetObj = { id: '', value: '' };
    } else {
      // Else the clicked facet was checked, so generate the object we want to use
      // to query the API.
      selectedFacetObj = {
        id: clickedFacet.value,
        value: clickedFacet.label || clickedFacet.value,
      };
    }

    // Update the state.
    this.setState({ facet: selectedFacetObj });
    // Need to create an object for this selection.
    pickedFacet[this.props.facet.field] = selectedFacetObj;
    // Merge the app's selected facets with this one, whether it was selected or not.
    // The unchecked empty selection will remove it.
    selectedFacets = _extend(this.props.selectedFacets, pickedFacet);

    const query = this.props.createAPIQuery({ selectedFacets });

    ajaxCall(`/api?${query}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updateSelectedFacets(selectedFacets);
      Actions.updatePage('1');
      this.routeHandler(`/search?${query}`);
      Actions.updateSpinner(false);
    });
  }

  getFacetLabel(field) {
    if (field === 'materialType') {
      return 'Material Type';
    } else if (field === 'subjectLiteral') {
      return 'Subject';
    }
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  routeHandler(path) {
    this.context.router.push(path);
  }

  showMoreFacets(e) {
    e.preventDefault();
    this.setState({ showMoreFacets: true });
  }

  showGetTenMore(valueCount) {
    const moreFacetsToShow = valueCount - FACETSHOWLIMIT;
    if (valueCount > FACETSHOWLIMIT && !this.state.showMoreFacets) {
      return (
        <button className="nypl-link-button" onClick={(e) => this.showMoreFacets(e)}>
          Show {moreFacetsToShow} more
        </button>
      );
    }
    return null;
  }

  showFacet() {
    if (this.state.openFacet === false) {
      this.setState({ openFacet: true });
    } else {
      this.setState({ openFacet: false });
    }
  }

  checkNoSearch(valueCount) {
    return valueCount > FACETSHOWLIMIT ? '' : ' nosearch';
  }

  render() {
    const facet = this.props.facet;
    const field = facet.field;
    const facetLabel = this.getFacetLabel(field);
    const noSearchClass = this.checkNoSearch(facet.values.length);
    const spinningClass = this.state.spinning ? 'spinning' : '';
    const collapsedClass = this.state.openFacet ? '' : 'collapsed';

    return (
      <div
        key={`${field}-${facet.value}`}
        className={`nypl-searchable-field nypl-spinner-field ${noSearchClass} ` +
          `${spinningClass} ${collapsedClass}`}
      >
        <button
          type="button"
          className={`nypl-facet-toggle ${collapsedClass}`}
          aria-controls={`nypl-searchable-field_${field}`}
          aria-expanded={this.state.openFacet}
          onClick={() => this.showFacet()}
        >
          {facetLabel}
          <svg
            aria-hidden="true"
            className="nypl-icon"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 68 24"
          >
            <title>wedge down icon</title>
            <polygon points="67.938 0 34 24 0 0 10 0 34.1 16.4 58.144 0 67.938 0"></polygon>
          </svg>
        </button>
        <div
          className={`nypl-collapsible ${collapsedClass}`}
          id={`nypl-searchable-field_${field}`}
          aria-expanded={this.state.openFacet}
        >
          <div className={`nypl-facet-search nypl-spinner-field ${spinningClass}`}>
            <label htmlFor={`facet-${field}-search`}>{facetLabel}</label>
            <input
              id={`facet-${field}-search`}
              type="text"
              placeholder={`Search ${facetLabel}`}
            />
          </div>
          <div className="nypl-facet-list">
            {
              facet.values.map((f, j) => {
                const percentage = Math.floor(f.count / this.props.totalHits * 100);
                const valueLabel = (f.value).toString().replace(/:/, '_');
                const hiddenFacet = (j > FACETSHOWLIMIT && !this.state.showMoreFacets) ?
                  'hiddenFacet' : '';
                let selectLabel = f.value;

                if (f.label) {
                  selectLabel = f.label;
                }

                return (
                  <label
                    key={j}
                    id={`${field}-${valueLabel}-label`}
                    htmlFor={`${field}-${valueLabel}`}
                    className={`nypl-bar_${percentage} ${hiddenFacet}`}
                  >
                    <input
                      id={`${field}-${valueLabel}`}
                      aria-labelledby={`${field}-${valueLabel}`}
                      type="checkbox"
                      name={`${field}-${valueLabel}-name`}
                      checked={this.props.selectedValue === f.value}
                      value={JSON.stringify(f)}
                      onClick={(e) => this.onFacetUpdate(e)}
                    />
                    <span className="nypl-facet-count">{f.count.toLocaleString()}</span>
                    {selectLabel}
                  </label>
                );
              })
            }
          </div>
          {this.showGetTenMore(facet.values.length)}
        </div>
      </div>
    );
  }
}

Facet.propTypes = {
  facet: React.PropTypes.object,
  selectedFacets: React.PropTypes.object,
  totalHits: React.PropTypes.number,
  selectedValue: React.PropTypes.string,
  createAPIQuery: React.PropTypes.func,
};

Facet.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Facet;
