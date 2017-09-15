import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import Store from '../../stores/Store.js';
import {
  findWhere as _findWhere,
  reject as _reject,
  extend as _extend,
} from 'underscore';

import {
  trackDiscovery,
  getDefaultFacets,
  ajaxCall,
} from '../../utils/utils.js';

import appConfig from '../../../../appConfig';
import FieldsetDate from '../Filters/FieldsetDate';
import FieldsetList from '../Filters/FieldsetList';
import Actions from '../../actions/Actions';

const XCloseSVG = () => (
  <svg width="48" height="19" viewBox="0 0 32 32" className="svgIcon">
    <title>x.close.icon</title>
    <path
      d={'M17.91272,15.97339l5.65689-5.65689A1.32622,1.32622,0,0,0,21.694,8.44093L16.' +
      '04938,14.0856l-5.65082-5.725A1.32671,1.32671,0,1,0,8.51,10.22454l5.66329,5.73712L8.' +
      '43038,21.7046a1.32622,1.32622,0,1,0,1.87557,1.87557l5.73088-5.73088,5.65074,5.72441' +
      'a1.32626,1.32626,0,1,0,1.88852-1.86261Z'}
    />
  </svg>
);

class FilterPopup extends React.Component {
  constructor(props) {
    super(props);

    const selectedFilters = this.props.selectedFilters;

    this.state = {
      selectedFilters: _extend(getDefaultFacets(), selectedFilters),
      filters: [],
      showForm: false,
      js: false,
      selectedFacets: Store.getState().selectedFacets,
    };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
    this.onFilterClick = this.onFilterClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    this.setState({
      js: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedFilters: nextProps.selectedFilters });
  }

  onFilterClick(filterId, filter) {
    const selectedFilters = this.state.selectedFilters;

    if (filter.selected) {
      selectedFilters[filterId].push(filter);
    } else {
      selectedFilters[filterId] =
        _reject(
          selectedFilters[filterId],
          (selectedFilter) => selectedFilter.value === filter.value
        );
    }

    this.setState({ selectedFilters });
  }

  submitForm(e) {
    e.preventDefault();
    const apiQuery = this.props.createAPIQuery({ selectedFacets: this.state.selectedFilters });

    this.deactivateForm();
    this.props.updateIsLoadingState(true);

    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
      if (response.data.searchResults && response.data.facets) {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
      } else {
        Actions.updateSearchResults({});
        Actions.updateFacets({});
      }
      Actions.updateSortBy('relevance');
      Actions.updatePage('1');

      setTimeout(() => {
        this.props.updateIsLoadingState(false);
        this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
      }, 500);
    });
  }

  openForm() {
    if (!this.state.showForm) {
      trackDiscovery('FilterPopup', 'Open');
      this.setState({ showForm: true });
    }
  }

  closeForm(e) {
    e.preventDefault();
    this.deactivateForm();
  }

  deactivateForm() {
    trackDiscovery('FilterPopup', 'Close');
    this.setState({ showForm: false });

    this.refs.filterOpen.focus();
  }

  render() {
    const {
      showForm,
      js,
      selectedFilters,
    } = this.state;
    const closePopupButton = js ?
      <button
        onClick={(e) => this.closeForm(e)}
        aria-expanded={!showForm}
        aria-controls="filter-popup-menu"
        className="popup-btn-close"
      >
        Close <XCloseSVG />
      </button>
      : (<a
        aria-expanded
        href="#"
        aria-controls="filter-popup-menu"
        className="popup-btn-close"
      >
        Close <XCloseSVG />
      </a>);
    const openPopupButton = js ?
      (<button
        className="popup-btn-open"
        onClick={() => this.openForm()}
        aria-haspopup="true"
        aria-expanded={showForm}
        aria-controls="filter-popup-menu"
        ref="filterOpen"
      >
        FILTER RESULTS
      </button>)
      : (<a
        className="popup-btn-open"
        href="#popup-no-js"
        aria-haspopup="true"
        aria-expanded={false}
        aria-controls="filter-popup-menu"
        ref="filterOpen"
      >
        FILTER RESULTS
      </a>);
    const {
      filters,
      searchKeywords,
    } = this.props;
    const materialTypeFilters = _findWhere(filters, { id: 'materialType' });
    const languageFilters = _findWhere(filters, { id: 'language' });

    return (
      <div className="filter-container">
        {openPopupButton}

        <div className={`popup-container ${showForm ? 'active' : ''}`} id={js ? '' : 'popup-no-js'}>
          {!js && (<a className="cancel-no-js" href="#"></a>)}
          <div className="overlay"></div>
          <FocusTrap
            focusTrapOptions={{
              onDeactivate: this.deactivateForm,
              clickOutsideDeactivates: true,
            }}
            active={showForm}
            id="filter-popup-menu"
            role="menu"
            className={`${js ? 'popup' : 'popup-no-js'} ${showForm ? 'active' : ''}`}
          >
            <form
              action={`${appConfig.baseUrl}/search?q=${searchKeywords}`}
              method="POST"
              onSubmit={() => this.onSubmitForm()}
            >
              <fieldset>
                <legend><h3>Filter Results</h3></legend>

                <FieldsetList
                  legend="Format"
                  filterId="materialType"
                  filter={materialTypeFilters}
                  selectedFilters={selectedFilters.materialType}
                  onFilterClick={this.onFilterClick}
                />

                <FieldsetDate selectedFacets={this.state.selectedFacets} />

                <FieldsetList
                  legend="Language"
                  filterId="language"
                  filter={languageFilters}
                  selectedFilters={selectedFilters.language}
                  onFilterClick={this.onFilterClick}
                />

                <button type="submit" name="apply-filters" onClick={this.submitForm}>
                  Apply Filters
                </button>
                <button type="button" name="Clear-Filters">Clear Filters</button>
                {closePopupButton}

              </fieldset>
            </form>
          </FocusTrap>
        </div>
      </div>
    );
  }
}

FilterPopup.propTypes = {
  location: PropTypes.object,
  filters: PropTypes.array,
  createAPIQuery: PropTypes.func,
  updateIsLoadingState: PropTypes.func,
  selectedFilters: PropTypes.object,
};

FilterPopup.defaultProps = {
  filters: [],
  createAPIQuery: () => {},
  updateIsLoadingState: () => {},
};

FilterPopup.contextTypes = {
  router: PropTypes.object,
};

export default FilterPopup;
