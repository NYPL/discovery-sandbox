import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

class FieldsetDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateAfter: '0',
      dateBefore: '0',
    };

    this.inputChange = this.inputChange.bind(this);
  }

  /**
   * inputChange()
   * Updates the states and the store based on the input values.
   *
   * @param {Event} e
   */
  inputChange(e) {
    const value = e.target.value;
    let displayValue = '';

    if (e.target.name === 'start-date') {
      displayValue = 'dateAfter';
    } else if (e.target.name === 'end-date') {
      displayValue = 'dateBefore';
    }

    if (displayValue) {
      this.setState(
        {
          [displayValue]: value,
        },
        () => {
          this.props.onDateFilterChange(displayValue, value);
        }
      );
    }
  }

  render() {
    let errorMessage = '';

    if (this.state.dateAfter && this.state.dateBefore) {
      if (Number(this.state.dateBefore) < Number(this.state.dateAfter)) {
        errorMessage = 'end year should be later than start year.';
      }
    } else {
      errorMessage = '';
    }

    return (
      <fieldset>
        <legend>Date</legend>
        <div id="input-container">
          <label htmlFor="star-date" id="startDate-label">Start Year
            <NumberFormat
              id="start-date"
              name="start-date"
              className="form-text"
              onChange={this.inputChange}
              format="####"
              aria-labelledby="startDate-label dateInput-status"
            />
          </label>
          <label htmlFor="end-date" id="endDate-label">End Year
            <NumberFormat
              id="end-date"
              name="end-date"
              className="form-text"
              onChange={this.inputChange}
              format="####"
              aria-labelledby="endDate-label dateInput-status"
            />
          </label>
          <span>The Start year cannot be later than the end year</span>
          <br />
          <span
            id="dateInput-status"
            className="nypl-field-status"
            aria-live="assertive"
            aria-atomic="true"
          >
            {errorMessage}
          </span>
        </div>
      </fieldset>
    );
  }
}

FieldsetDate.propTypes = {
  onDateFilterChange: PropTypes.func,
};

export default FieldsetDate;
