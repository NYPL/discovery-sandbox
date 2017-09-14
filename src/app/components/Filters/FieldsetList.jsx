import React from 'react';
import PropTypes from 'prop-types';

import { isEmpty as _isEmpty } from 'underscore';

class FieldsetList extends React.Component {
  render() {
    const {
      legend,
      filter,
    } = this.props;

    if (_isEmpty(filter)) {
      return null;
    }

    const values = filter.values && filter.values.length ? filter.values : [];

    return (
      <fieldset>
        {legend && <legend>{legend}</legend>}
        <ul>
          {
            values.map((value, i) => (
              <li className="nypl-terms-checkbox new-checkbox" key={i}>
                <input
                  id={`${value.label}-label`}
                  type="checkbox"
                  name="language"
                  value={value.value}
                />
                <label htmlFor={`${value.label}-label`}>
                  {value.label} ({value.count.toLocaleString()})
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
};

FieldsetList.defaultProps = {
  filter: {},
};

export default FieldsetList;
