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

import Actions from '../../actions/Actions';
import appConfig from '../../../../appConfig';
import { ajaxCall } from '../../utils/utils';

const XCloseIcon = () => (
  <svg
    className="nypl-icon svgIcon"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 32 32"
  >
    <title>Remove Filter</title>
    <path
      d={'M17.91272,15.97339l5.65689-5.65689A1.32622,1.32622,0,0,0,21.694,8.44093L16.04938' +
        ',14.0856l-5.65082-5.725A1.32671,1.32671,0,1,0,8.51,10.22454l5.66329,5.73712L8.4303' +
        '8,21.7046a1.32622,1.32622,0,1,0,1.87557,1.87557l5.73088-5.73088,5.65074,5.72441a1.3' +
        '2626,1.32626,0,1,0,1.88852-1.86261Z'}
    />
  </svg>
);

class SelectedFilters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      js: false,
    };
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

    const apiQuery = this.props.createAPIQuery({ selectedFacets: selectedFilters });

    this.props.updateIsLoadingState(true);

    Actions.updateSelectedFacets(selectedFilters);
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

  render() {
    const {
      selectedFilters,
    } = this.props;

    if (_isEmpty(selectedFilters)) {
      return null;
    }

    const filtersToRender = [];
    const acceptedFilters = _keys(appConfig.defaultFacets);

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
      <ul
        className="selected-filters-container"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions removals"
        aria-describedby="read-text"
      >
        <li id="read-text" className="visuallyHidden">
          There are {filtersToRender.length} selected filters.
        </li>
        {
          filtersToRender.map((filter, i) => {
            let filterBtn = (
              <button
                className="nypl-unset-filter"
                onClick={(e) => this.onFilterClick(e, filter)}
                aria-controls="selected-filters-container"
                aria-label={filter.label}
              >
                {filter.label}
                <XCloseIcon />
              </button>
            );

            if (!this.state.js) {
              const removedSelectedFilters = JSON.parse(JSON.stringify(selectedFilters));
              removedSelectedFilters[filter.field] =
                _reject(selectedFilters[filter.field], (f) => (f.value === filter.value));

              const apiQuery = this.props.createAPIQuery({
                selectedFacets: removedSelectedFilters,
              });

              filterBtn = (
                <a
                  className="nypl-unset-filter"
                  href={`${appConfig.baseUrl}/search?${apiQuery}`}
                  aria-controls="selected-filters-container"
                  aria-label={filter.label}
                >
                  {filter.label}
                  <XCloseIcon />
                </a>
              );
            }

            return (<li key={i}>{filterBtn}</li>);
          })
        }
      </ul>
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
