import React from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty as _isEmpty,
  reject as _reject,
} from 'underscore';
import { XIcon } from '@nypl/dgx-svg-icons';

import appConfig from '../../../../appConfig';

class SelectedDateFilters extends React.Component {
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

  render() {
    const {
      selectedFilters,
      datesToRender,
    } = this.props;

    if (_isEmpty(datesToRender)) {
      return null;
    }

    return datesToRender.map((filter, i) => {
      const singleDate = datesToRender.length === 1;
      const dateClass = filter.field;
      let singleDateLabel = '';
      if (singleDate) {
        if (dateClass === 'dateAfter') {
          singleDateLabel = 'After';
        } else if (dateClass === 'dateBefore') {
          singleDateLabel = 'Before';
        }
      }

      let filterBtn = (
        <button
          className="nypl-unset-filter"
          onClick={e => this.onFilterClick(e, filter)}
          aria-controls="selected-filters-container"
          aria-label={`${singleDateLabel} ${filter.label} Remove Filter`}
        >
          {singleDateLabel} {filter.label}
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

      return (
        <li
          className={`${dateClass} ${!singleDate ? 'combined' : ''}`}
          key={i}
        >
          {filterBtn}
        </li>
      );
    });
  }
}

SelectedDateFilters.propTypes = {
  selectedFilters: PropTypes.object,
  createAPIQuery: PropTypes.func,
  datesToRender: PropTypes.array,
};

SelectedDateFilters.defaultProps = {
  selectedFilters: {},
  createAPIQuery: () => {},
  datesToRender: [],
};

SelectedDateFilters.contextTypes = {
  router: PropTypes.object,
};

export default SelectedDateFilters;
