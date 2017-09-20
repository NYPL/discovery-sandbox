import React from 'react';
import PropTypes from 'prop-types';

import {
  extend as _extend,
  findWhere as _findWhere,
} from 'underscore';

class FieldsetList extends React.Component {
  constructor(props) {
    super(props);

    const {
      filter,
      selectedFilters,
    } = this.props;
    const filterValues = filter.values && filter.values.length ? filter.values : [];
    // Just want to add the `selected` property here.
    const defaultFilterValues = filterValues.map(value => _extend({ selected: false }, value));
    let updatedFilterValues = defaultFilterValues;

    // If there are selected filters, then we want to update the filter values with those
    // filters already selected. That way, the checkboxes will be checked.
    if (selectedFilters) {
      updatedFilterValues = defaultFilterValues.map(defaultFilterValue => {
        const defaultFilter = defaultFilterValue;
        selectedFilters.forEach(selectedFilter => {
          if (selectedFilter.value === defaultFilter.value) {
            defaultFilter.selected = true;
          }
        });

        return defaultFilter;
      });
    }

    this.state = {
      values: updatedFilterValues,
    };

    this.onFilterClick = this.onFilterClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);

    const {
      filter,
      selectedFilters,
    } = nextProps;
    const filterValues = filter.values && filter.values.length ? filter.values : [];
    // Just want to add the `selected` property here.
    const defaultFilterValues = filterValues.map(value => _extend({ selected: false }, value));
    let updatedFilterValues = defaultFilterValues;

    // If there are selected filters, then we want to update the filter values with those
    // filters already selected. That way, the checkboxes will be checked.
    if (selectedFilters) {
      updatedFilterValues = defaultFilterValues.map(defaultFilterValue => {
        const defaultFilter = defaultFilterValue;
        selectedFilters.forEach(selectedFilter => {
          if (selectedFilter.value === defaultFilter.value) {
            defaultFilter.selected = true;
          }
        });

        return defaultFilter;
      });
    }

    this.setState({ values: updatedFilterValues });
  }

  onFilterClick(e, filter) {
    // Find the filter we selected and toggle it's selected value.
    const match = _findWhere(this.state.values, { value: filter.value });
    if (match) {
      match.selected = !filter.selected;
    }

    this.setState({ values: this.state.values });
    this.props.onFilterClick(this.props.filterId, filter);
  }

  render() {
    const {
      legend,
      filterId,
    } = this.props;
    const values = this.state.values;

    if (!values || !values.length) {
      return null;
    }

    return (
      <fieldset>
        {legend && <legend>{legend}</legend>}
        <ul>
          {
            values.map((filter, i) => (
              <li className="nypl-generic-checkbox" key={i}>
                <input
                  id={`${filter.label}-label`}
                  type="checkbox"
                  name="filters"
                  value={JSON.stringify(_extend({ field: filterId }, filter))}
                  onClick={(e) => this.onFilterClick(e, filter)}
                  checked={filter.selected}
                />
                <label htmlFor={`${filter.label}-label`}>
                  {filter.label} ({filter.count.toLocaleString()})
                </label>
              </li>
            ))
          }
        </ul>
      </fieldset>
    );
  }
}

FieldsetList.propTypes = {
  legend: PropTypes.string,
  filter: PropTypes.object,
  filterId: PropTypes.string,
  onFilterClick: PropTypes.func,
  selectedFilters: PropTypes.array,
};

FieldsetList.defaultProps = {
  filter: {},
  onFilterClick: () => {},
};

export default FieldsetList;
