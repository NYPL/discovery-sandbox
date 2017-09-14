import React from 'react';
import PropTypes from 'prop-types';

class FilterPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDateInput: '',
      endDateInput: '',
    };
  }

  render() {
    return (
      <fieldset>
        <legend>Date</legend>
        <div>
          <label htmlFor="start-date">Start Year
            <input
              id="start-date"
              name="start-date"
              className="form-text"
              type="number"
              max="9999"
            />
          </label>
          <label htmlFor="end-date">End Year
            <input
              id="end-date"
              name="end-date"
              className="form-text"
              type="number"
              max="9999"
            />
          </label>
          <span>The Start year cannot be later than the end year</span>
        </div>
      </fieldset>
    );
  }
}

FilterPopup.propTypes = {
  location: PropTypes.object,
};

export default FilterPopup;
