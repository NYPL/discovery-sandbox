import React from 'react';

import {
  isEmpty as _isEmpty,
} from 'underscore';

class DateRange extends React.Component {
  render() {
    const dateRange = this.props.dateRange;

    if (_isEmpty(dateRange)) return null;
    const min = dateRange.values[0].label;
    const max = dateRange.values[dateRange.values.length - 1].label;

    return (
      <fieldset>
        <label htmlFor="select-date-range">Date</label>
        <div id="select-date-range" className="date-range">
          <input
            id="input-date-start"
            name="date-start"
            type="text"
            defaultValue={min}
            size="9"
          />
          <div className="divider">to</div>
          <input
            id="input-date-end"
            name="date-end"
            type="text"
            defaultValue={max}
            size="9"
          />
        </div>
      </fieldset>
    );
  }
}

DateRange.propTypes = {
  dateRange: React.PropTypes.object,
};

export default DateRange;
