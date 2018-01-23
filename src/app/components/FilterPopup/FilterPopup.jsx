import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  findWhere as _findWhere,
  reject as _reject,
  extend as _extend,
  map as _map,
  isEmpty as _isEmpty,
  some as _some,
} from 'underscore';
import {
  CheckSoloIcon,
  FilterIcon,
  ResetIcon,
} from '@nypl/dgx-svg-icons';

import {
  trackDiscovery,
  ajaxCall,
} from '../../utils/utils';

import appConfig from '../../../../appConfig';
import FieldsetDate from '../Filters/FieldsetDate';
import FieldsetList from '../Filters/FieldsetList';
import Actions from '../../actions/Actions';

const FilterResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="57.69298" height="71.85359" viewBox="0 0 57.69298 71.85359">
    <title>filter.reset.icon</title>
    <g>
      <path d="M22.98743,71.85359a2.82155,2.82155,0,0,1-2.82082-2.82082V38.545L.7499,17.6096A2.82138,2.82138,0,0,1,4.893,13.77872L25.80825,36.33386V69.03277A2.82155,2.82155,0,0,1,22.98743,71.85359Z"/>
      <path d="M34.447,63.63651a2.82155,2.82155,0,0,1-2.82082-2.82082V36.35223l21.15409-23.199a2.82154,2.82154,0,0,1,4.18715,3.78313L37.26782,38.52661V60.81569A2.82155,2.82155,0,0,1,34.447,63.63651Z"/>
      <path d="M31.17492,11.19237l7.7782-7.77814A2,2,0,0,0,36.12469.5858L28.34649,8.364,20.56829.5858a2,2,0,1,0-2.82843,2.82843l7.7782,7.77814-7.7782,7.7782A2,2,0,0,0,20.56829,21.799l7.7782-7.7782,7.7782,7.7782a2,2,0,0,0,2.82843-2.82843Z"/>
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
        dateAfter: undefined,
        dateBefore: undefined,
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
      if (val.name && val.value) {
        const anchorTag = (this.state.js) ?
          <a href={`#${headlineError[val.name]}`}>{val.value}</a> : <span>{val.value}</span>;

        errorArray.push(<li key={key}>{anchorTag}</li>);
      }
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

    this.closeForm(e);
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
      this.setState({ showForm: true });
      this.props.updateDropdownState(true);
    }
  }

  closeForm(e) {
    e.preventDefault();
    trackDiscovery('FilterPopup', 'Close');
    this.setState({ showForm: false });
    this.props.updateDropdownState(false);

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

    const applyButton = (
      <button
        type="submit"
        name="apply-filters"
        onClick={e => this.submitForm(e)}
        className="nypl-primary-button apply-button"
      >
        Apply Filters
        <CheckSoloIcon
          className="apply-icon"
          preserveAspectRatio="xMidYMid meet"
          title="apply"
          labelledById="apply"
          iconId="filterApply"
        />
      </button>);
    const cancelButton = (
      <button
        onClick={this.closeForm}
        aria-expanded={!showForm}
        aria-controls="filter-popup-menu"
        className="nypl-filter-button cancel-button"
      >
        Cancel
      </button>
    );
    const resetButton = (
      <button
        type="button"
        name="Clear-Filters"
        className="nypl-basic-button clear-filters-button"
        onClick={this.clearFilters}
      >
        Clear Filters
        <FilterResetIcon
          className="nypl-icon"
          preserveAspectRatio="xMidYMid meet"
          title="reset"
        />
      </button>);
    const openButton = (
      <button
        className="popup-btn-open nypl-primary-button"
        onClick={() => this.openForm()}
        aria-haspopup="true"
        aria-expanded={showForm || null}
        aria-controls="filter-popup-menu"
      >
        Add filters <FilterIcon />
      </button>
    );
    const popupOrApplyButton = showForm ? applyButton : openButton;
    const openPopupButton = js ?
      popupOrApplyButton :
      (<a
        className="popup-btn-open nypl-primary-button"
        href="#popup-no-js"
        aria-haspopup="true"
        aria-expanded={false}
        aria-controls="filter-popup-menu"
        ref="filterOpen"
      >
        Add filters <FilterIcon />
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
      <div
        className="nypl-form-error filter-error-box"
        ref="nypl-filter-error"
        tabIndex="0"
      >
        <h2>Error</h2>
        <p>Please enter valid filter values:</p>
        <ul>
          {this.getRaisedErrors(this.state.raisedErrors)}
        </ul>
      </div>
    );
    const isDateInputError = _some(this.state.raisedErrors, item =>
      (item.name && item.name === 'date'));

    return (
      <div className="filter-container">
        <div className="filter-text">
          <h2>Refine your search</h2>
        </div>
        <div className="filter-action-buttons">
          {!showForm && (<p>Add filters to narrow and define your search</p>)}
          {showForm && resetButton}
          <div className="cancel-apply-buttons">
            {showForm && cancelButton}
            {openPopupButton}
          </div>
        </div>
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
          <p id="modal-description" className="nypl-screenreader-only">Filter search results</p>
          <div
            id="filter-popup-menu"
            className={
              `${js ? 'popup' : 'popup-no-js'} nypl-modal-filter-form nypl-popup-filter-menu ` +
              `${showForm ? 'expand active' : 'collapse'}`
            }
          >
            {
              this.state.raisedErrors && !_isEmpty(this.state.raisedErrors) && (errorMessageBlock)
            }
            <form
              action={`${appConfig.baseUrl}/search?q=${searchKeywords}`}
              method="POST"
              onSubmit={() => this.submitForm()}
            >
              <fieldset className="nypl-fieldset">
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
                  {resetButton}
                  <div className="cancel-apply-buttons">
                    {cancelButton}
                    {applyButton}
                  </div>
                </div>
              </fieldset>
            </form>
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
  updateDropdownState: PropTypes.func,
};

FilterPopup.defaultProps = {
  filters: [],
  createAPIQuery: () => {},
  updateIsLoadingState: () => {},
  updateDropdownState: () => {},
};

FilterPopup.contextTypes = {
  router: PropTypes.object,
};

export default FilterPopup;
