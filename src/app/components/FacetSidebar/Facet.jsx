import React from 'react';
import PropTypes from 'prop-types';
import {
  extend as _extend,
  reject as _reject,
  findWhere as _findWhere,
  isEmpty as _isEmpty,
} from 'underscore';
import { DownWedgeIcon } from 'dgx-svg-icons';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

const FACETSHOWLIMIT = 4;

class Facet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openFacet: true,
      selectedValues: [],
      showMoreFacets: false,
    };

    this.routeHandler = this.routeHandler.bind(this);
    this.onFacetUpdate = this.onFacetUpdate.bind(this);
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ openFacet: false });
    }, 500);
  }

  componentWillReceiveProps(nextProps) {
    // If the selected facets are empty, e.g if there's a new sort, then we can empty out
    // the current array of selected values for a facet so they don't carry over.
    if (_isEmpty(nextProps.selectedFacets)) {
      this.setState({ selectedValues: [] });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onFacetUpdate(e) {
    Actions.updateSpinner(true);
    // In order for this to work, the facet object is passed as a stringified JSON string.
    // That way we get the whole clicked facet and then there's no need to search for it.
    const clickedFacet = JSON.parse(e.target.value);
    const checked = e.target.checked;
    const pickedFacet = {};
    // Get any existing selected value from the facet:
    let selectedValues = this.state.selectedValues;
    let selectedFacets = {};
    let selectedFacetObj = {};

    // If the clicked facet is unchecked, make its selection empty.
    // Remove it from existing selected facet array.
    if (!checked) {
      selectedFacetObj = { id: '', value: '' };
      selectedValues = _reject(selectedValues, { id: clickedFacet.value });
    } else {
      // Else the clicked facet was checked, so generate the object we want to use
      // to query the API.
      selectedFacetObj = {
        id: clickedFacet.value,
        value: clickedFacet.label || clickedFacet.value,
      };

      // Only add the clicked facet if it wasn't already selected.
      const alreadySelected = _findWhere(selectedValues, { id: clickedFacet.value });
      if (!alreadySelected) {
        // Add new selected value only if it's checked.
        selectedValues.push(selectedFacetObj);
      }
    }

    // Update the state.
    this.setState({ selectedValues });
    // Need to create an object for this selection.
    pickedFacet[this.props.facet.field] = selectedValues;
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
      return 'Format';
    } else if (field === 'subjectLiteral') {
      return 'Subject';
    } else if (field === 'owner') {
      return 'Owning Location/Division';
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
    const spinningClass = this.props.spinning ? 'spinning' : '';
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
          <DownWedgeIcon className="nypl-icon" viewBox="0 0 68 24" />
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
                const valueLabel = (f.value).toString().replace(/\s+/g, '_').replace(/:/g, '_');
                const hiddenFacet = (j > FACETSHOWLIMIT && !this.state.showMoreFacets) ?
                  'hiddenFacet' : '';
                const selected = !!_findWhere(this.props.selectedValues, { id: f.value });
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
                      aria-labelledby={`${field}-${valueLabel}-label`}
                      type="checkbox"
                      name={`${field}-${valueLabel}-name`}
                      checked={selected}
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
  facet: PropTypes.object,
  selectedFacets: PropTypes.object,
  totalHits: PropTypes.number,
  selectedValues: PropTypes.array,
  createAPIQuery: PropTypes.func,
  spinning: PropTypes.bool,
};

Facet.contextTypes = {
  router: PropTypes.object,
};

export default Facet;
