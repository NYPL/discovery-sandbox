import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import {
  findWhere as _findWhere,
  reject as _reject,
  extend as _extend,
  map as _map,
  isEmpty as _isEmpty,
  some as _some,
} from 'underscore';

import {
  trackDiscovery,
  ajaxCall,
} from '../../utils/utils.js';

import { ApplyIcon, ResetIcon } from 'dgx-svg-icons';

import appConfig from '../../../../appConfig';
import FieldsetDate from '../Filters/FieldsetDate';
import FieldsetList from '../Filters/FieldsetList';
import Actions from '../../actions/Actions';

const XCloseSVG = () => (
  <svg
    aria-hidden="true"
    aria-controls="filter-popup-menu"
    className="nypl-icon"
    preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100"
  >
    <title>x-close-rev</title>
    <path
      d={'M82.07922,14.06287a48.0713,48.0713,0,1,0,0,68.01563A48.15148,48.15148,0,0,0,82.0792' +
        '2,14.06287ZM65.06232,60.84845A2.97437,2.97437,0,1,1,60.827,65.0257L48.154,52.18756,35' +
        '.30133,65.04022a2.97432,2.97432,0,1,1-4.20636-4.2063L43.97473,47.95416,31.27362,35.087' +
        '46A2.97542,2.97542,0,0,1,35.509,30.90729L48.18213,43.7467,60.84149,31.0874a2.97432,2.9' +
        '7432,0,0,1,4.2063,4.20636L52.36108,47.98047Z'}
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    aria-hidden="true"
    className="nypl-icon"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 19 22"
  >
    <title>filter.icon.3</title>
    <g>
      <circle cx="6.65947" cy="2.31986" r="1.31924" />
      <circle cx="13.18733" cy="1.31986" r="1.31895" />
      <circle cx="9.56477" cy="5.46901" r="1.31927" />
      <g>
        <path
          d={'M7.74355,22.50683a.95047.95047,0,0,1-.95022-.95022V11.28645L.25259,4.2341' +
          '3A.95041.95041,0,1,1,1.64824,2.94366l7.04554,7.598v11.015A.95047.95047,0,0,1,7.7435' +
          '5,22.50683Z'}
        />
        <path
          d={'M11.60384,19.73881a.95047.95047,0,0,1-.95022-.95022V10.5478l7.126-7.81485a.' +
          '95047.95047,0,0,1,1.41049,1.27439l-6.636,7.27293v7.50832A.95047.95047,0,0,1,11.60384,' +
          '19.73881Z'}
        />
      </g>
    </g>
  </svg>
);

class FilterPopup extends React.Component {
  constructor(props) {
    super(props);

    const {
      selectedFilters,
      filters,
      raisedErrors,
    } = this.props;

    this.state = {
      selectedFilters: _extend({
        materialType: [],
        language: [],
        dateAfter: '',
        dateBefore: '',
      }, selectedFilters),
      showForm: false,
      js: false,
      filters,
      raisedErrors,
    };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
    this.onFilterClick = this.onFilterClick.bind(this);
    this.onDateFilterChange = this.onDateFilterChange.bind(this);
    this.validateFilterValue = this.validateFilterValue.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount() {
    this.setState({
      js: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedFilters: _extend({
        materialType: [],
        language: [],
        dateAfter: {},
        dateBefore: {},
      }, nextProps.selectedFilters),
      filters: nextProps.filters,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // This check is to make sure it only focus after hitting submit and states
    // changed
    if (prevState.raisedErrors !== this.state.raisedErrors) {
      if (this.refs['nypl-filter-error']) {
        ReactDOM.findDOMNode(this.refs['nypl-filter-error']).focus();
      }
    }
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

  /**
   * onDateFilterChange(filterId, value)
   * The function to be passed down to FieldsetDate component for updating the value of its input.
   *
   * @param {String} filterId
   * @param {String} value
   */
  onDateFilterChange(filterId, value) {
    const selectedFilters = this.state.selectedFilters;

    selectedFilters[filterId] = value;
    this.setState({ selectedFilters });
  }

  /*
   * getRaisedErrors(errors)
   * There's a set list of inputs in the filter form. If the key errors from the form
   * are found in the set list, it will render those errors. This is meant to be an
   * aggregate list that is displayed at the top of the form.
   * @param {Array} errors - An array of the objects with key/value pair of input elements in the
   *   filter form that have incorrect input.
   * @return {Array}
   */
  getRaisedErrors(errors) {
    const headlineError = {
      date: 'dateAfter',
    };
    const errorArray = [];

    if (!errors || _isEmpty(errors)) {
      return null;
    }

    _map(errors, (val, key) => {
      errorArray.push(<li key={key}><a href={`#${headlineError[val.name]}`}>{val.value}</a></li>);
    });

    return errorArray;
  }

  /*
   * validateFilterValue(filterValue)
   * Checks if the values from the input fields are valid. If not, updates the state.
   *
   * @param {Object} filterValue
   * @return {Boolean}
   */
  validateFilterValue(filterValue) {
    const filterErrors = [];

    if (filterValue.dateBefore && filterValue.dateAfter) {
      // If the date input values are invalid
      if (Number(filterValue.dateBefore) < Number(filterValue.dateAfter)) {
        const dateInputError = {
          name: 'date',
          value: 'Date',
        };

        filterErrors.push(dateInputError);
      }
    }

    this.setState({ raisedErrors: filterErrors });

    if (!_isEmpty(filterErrors) || filterErrors.length) {
      return false;
    }

    return true;
  }

  submitForm(e) {
    e.preventDefault();

    if (!this.validateFilterValue(this.state.selectedFilters)) {
      return false;
    }

    const apiQuery = this.props.createAPIQuery({ selectedFilters: this.state.selectedFilters });

    this.deactivateForm();
    this.props.updateIsLoadingState(true);

    Actions.updateSelectedFilters(this.state.selectedFilters);
    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
      if (response.data.searchResults && response.data.filters) {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFilters(response.data.filters);
      } else {
        Actions.updateSearchResults({});
        Actions.updateFilters({});
      }
      Actions.updateSortBy('relevance');
      Actions.updatePage('1');

      setTimeout(() => {
        this.props.updateIsLoadingState(false);
        this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
      }, 500);
    });

    return true;
  }

  /**
   * clearFilters()
   * Clears all the selected filters before making an API call.
   *
   */
  clearFilters(e) {
    e.persist();
    this.setState(
      {
        selectedFilters: {
          materialType: [],
          language: [],
          dateAfter: '',
          dateBefore: '',
        },
      },
      () => { this.submitForm(e); }
    );
  }

  openForm() {
    if (!this.state.showForm) {
      trackDiscovery('FilterPopup', 'Open');
      this.setState(
        { showForm: true },
        () => {
          document.body.classList.add('no-scroll');
        }
      );
    }
  }

  closeForm(e) {
    e.preventDefault();
    this.deactivateForm();
  }

  deactivateForm() {
    trackDiscovery('FilterPopup', 'Close');
    this.setState(
      { showForm: false },
      () => {
        document.body.classList.remove('no-scroll');
      }
    );

    if (this.refs.filterOpen) {
      this.refs.filterOpen.focus();
    }
  }

  render() {
    const {
      showForm,
      js,
      selectedFilters,
      filters,
    } = this.state;

    const closePopupButton = js ?
      <button
        onClick={(e) => this.closeForm(e)}
        aria-expanded={!showForm}
        aria-controls="filter-popup-menu"
        className="popup-btn-close nypl-x-close-button"
      >
        Close <XCloseSVG />
      </button>
      : (<a
        aria-expanded
        href="#"
        aria-controls="filter-popup-menu"
        className="popup-btn-close nypl-x-close-button"
      >
        Close <XCloseSVG />
      </a>);
    const openPopupButton = js ?
      (<button
        className="popup-btn-open nypl-short-button"
        onClick={() => this.openForm()}
        aria-haspopup="true"
        aria-expanded={showForm}
        aria-controls="filter-popup-menu"
        ref="filterOpen"
      >
        FILTER RESULTS <FilterIcon />
      </button>)
      : (<a
        className="popup-btn-open nypl-short-button"
        href="#popup-no-js"
        aria-haspopup="true"
        aria-expanded={false}
        aria-controls="filter-popup-menu"
        ref="filterOpen"
      >
        FILTER RESULTS <FilterIcon />
      </a>);
    const { searchKeywords } = this.props;
    const materialTypeFilters = _findWhere(filters, { id: 'materialType' });
    const languageFilters = _findWhere(filters, { id: 'language' });
    const dateAfterFilterValue =
      selectedFilters.dateAfter ? Number(selectedFilters.dateAfter) : null;
    const dateBeforeFilterValue =
      selectedFilters.dateBefore ? Number(selectedFilters.dateBefore) : null;
    const dateSelectedFilters = {
      dateAfter: dateAfterFilterValue,
      dateBefore: dateBeforeFilterValue,
    };
    const errorMessageBlock = (
      <div className="nypl-form-error filter-error-box" ref="nypl-filter-error" tabIndex="0">
        <h2>Error</h2>
        <p>Please enter valid filter values:</p>
        <ul>
          {this.getRaisedErrors(this.state.raisedErrors)}
        </ul>
      </div>
    );
    const isDateInputError = _some(this.state.raisedErrors, (item) =>
      (item.name && item.name === 'date')
    );

    return (
      <div className="filter-container">
        {openPopupButton}
        <div
          className={
            'nypl-basic-modal-container nypl-popup-container popup-container ' +
            `${showForm ? 'active' : ''}`
          }
          id={js ? '' : 'popup-no-js'}
          role="dialog"
          aria-labelledby="filter-title"
          aria-describedby="modal-description"
        >
          {!js && (<a className="cancel-no-js" href="#"></a>)}
          <div className="nypl-modal-content">
            <div className="nypl-popup-filter-overlay"></div>
            <p id="modal-description" className="nypl-screenreader-only">Filter search results</p>
            <FocusTrap
              focusTrapOptions={{
                onDeactivate: this.deactivateForm,
                clickOutsideDeactivates: true,
              }}
              active={showForm}
              id="filter-popup-menu"
              role="menu"
              className={
                `${js ? 'popup' : 'popup-no-js'} nypl-modal-filter-form nypl-popup-filter-menu ` +
                `${showForm ? 'active' : ''}`
              }
            >
              {
                this.state.raisedErrors && !_isEmpty(this.state.raisedErrors) && (errorMessageBlock)
              }
              <form
                action={`${appConfig.baseUrl}/search?q=${searchKeywords}`}
                method="POST"
                onSubmit={() => this.onSubmitForm()}
              >
                <fieldset className="nypl-fieldset">
                  <legend><h3 id="filter-title">Filter Results</h3></legend>

                  <FieldsetList
                    legend="Format"
                    filterId="materialType"
                    filter={materialTypeFilters}
                    selectedFilters={selectedFilters.materialType}
                    onFilterClick={this.onFilterClick}
                  />

                  <FieldsetDate
                    legend="Date"
                    selectedFilters={dateSelectedFilters}
                    onDateFilterChange={this.onDateFilterChange}
                    submitError={isDateInputError}
                  />

                  <FieldsetList
                    legend="Language"
                    filterId="language"
                    filter={languageFilters}
                    selectedFilters={selectedFilters.language}
                    onFilterClick={this.onFilterClick}
                  />

                  <div className="inner nypl-filter-button-container">
                    <button
                      id="submit-form"
                      type="submit"
                      name="apply-filters"
                      onClick={this.submitForm}
                      className="nypl-filter-button"
                    >
                      <ApplyIcon
                        className="nypl-icon"
                        preserveAspectRatio="xMidYMid meet"
                        title="apply"
                      />
                      Apply Filters
                    </button>
                    <button
                      id="clear-filters"
                      type="button"
                      name="Clear-Filters"
                      className="nypl-filter-button"
                      onClick={this.clearFilters}
                    >
                      <ResetIcon
                        className="nypl-icon"
                        preserveAspectRatio="xMidYMid meet"
                        title="reset"
                      />
                      Clear Filters
                    </button>
                  </div>
                </fieldset>
              </form>
            </FocusTrap>
            {closePopupButton}
          </div>
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
  searchKeywords: PropTypes.string,
  raisedErrors: PropTypes.array,
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
