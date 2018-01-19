import React from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty as _isEmpty,
  mapObject as _mapObject,
  extend as _extend,
  reject as _reject,
  keys as _keys,
  contains as _contains,
  isArray as _isArray,
} from 'underscore';
import {
  FilterIcon,
  XIcon,
} from '@nypl/dgx-svg-icons';

import Actions from '../../actions/Actions';
import appConfig from '../../../../appConfig';
import { ajaxCall } from '../../utils/utils';

class SelectedFilters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      js: false,
    };

    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount() {
    this.setState({ js: true });
  }

  onFilterClick(e, filter) {
    e.preventDefault();

    const selectedFilters = this.props.selectedFilters;
    const field = filter.field;

    if (field === 'dateAfter' || field === 'dateBefore') {
      if (filter.value !== '') {
        selectedFilters[field] = '';
      }
    } else {
      selectedFilters[field] =
        _reject(
          selectedFilters[field],
          (selectedFilter) => selectedFilter.value === filter.value
        );
    }

    const apiQuery = this.props.createAPIQuery({ selectedFilters });

    this.props.updateIsLoadingState(true);

    Actions.updateSelectedFilters(selectedFilters);
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
  }

  clearFilters() {
    const apiQuery = this.props.createAPIQuery({ selectedFilters: {} });

    this.props.updateIsLoadingState(true);
    Actions.updateSelectedFilters({});
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
  }

  render() {
    const {
      selectedFilters,
    } = this.props;

    if (_isEmpty(selectedFilters)) {
      return null;
    }

    const filtersToRender = [];
    const acceptedFilters = _keys(appConfig.defaultFilters);
    let clearAllFilters = (
      <button
        className="nypl-unset-filter clear-filters-button"
        onClick={this.clearFilters}
        aria-controls="selected-filters-container"
        aria-label="Clear all filters"
      >
        Clear Filters
        <FilterIcon ariaHidden />
      </button>
    );

    if (!this.state.js) {
      const apiQuery = this.props.createAPIQuery({ selectedFilters: {} });

      clearAllFilters = (
        <a
          className="nypl-unset-filter clear-filters-button"
          href={`${appConfig.baseUrl}/search?${apiQuery}`}
          aria-controls="selected-filters-container"
          aria-label="Clear all filters"
        >
          Clear Filters
          <FilterIcon ariaHidden />
        </a>
      );
    }

    _mapObject(selectedFilters, (values, key) => {
      if (_contains(acceptedFilters, key) && values && values.length) {
        if (_isArray(values)) {
          values.forEach(value => {
            filtersToRender.push(_extend({ field: key }, value));
          });
        } else {
          filtersToRender.push(_extend({ field: key },
            {
              value: values,
              label: values,
            }
          ));
        }
      }
    });

    if (!filtersToRender.length) {
      return null;
    }

    return (
      <div>
        <span id="read-text" className="visuallyHidden">Selected filters.</span>
        <ul
          id="selected-filters-container"
          aria-live="assertive"
          aria-atomic="true"
          aria-relevant="additions removals"
          aria-describedby="read-text"
        >
          {
            filtersToRender.map((filter, i) => {
              const dateClass = filter.field;
              let filterBtn = (
                <button
                  className="nypl-unset-filter"
                  onClick={e => this.onFilterClick(e, filter)}
                  aria-controls="selected-filters-container"
                  aria-label={`${filter.label} Remove Filter`}
                >
                  {filter.label}
                  <XIcon fill="#fff" ariaHidden />
                </button>
              );

              if (!this.state.js) {
                const removedSelectedFilters = JSON.parse(JSON.stringify(selectedFilters));
                removedSelectedFilters[filter.field] =
                  _reject(
                    selectedFilters[filter.field],
                    f => (f.value === filter.value),
                  );

                const apiQuery = this.props.createAPIQuery({
                  selectedFilters: removedSelectedFilters,
                });

                filterBtn = (
                  <a
                    className="nypl-unset-filter"
                    href={`${appConfig.baseUrl}/search?${apiQuery}`}
                    aria-controls="selected-filters-container"
                    aria-label={filter.label}
                  >
                    {filter.label}
                    <XIcon fill="#fff" ariaHidden />
                  </a>
                );
              }

              return (<li key={i} className={dateClass}>{filterBtn}</li>);
            })
          }
          <li>
            {clearAllFilters}
          </li>
        </ul>
      </div>
    );
  }
}

SelectedFilters.propTypes = {
  selectedFilters: PropTypes.object,
  createAPIQuery: PropTypes.func,
  updateIsLoadingState: PropTypes.func,
};

SelectedFilters.defaultProps = {
  selectedFilters: {},
  createAPIQuery: () => {},
};

SelectedFilters.contextTypes = {
  router: PropTypes.object,
};

export default SelectedFilters;
