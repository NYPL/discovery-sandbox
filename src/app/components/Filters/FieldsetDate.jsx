import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

class FieldsetDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateAfter: this.props.selectedFilters.dateAfter,
      dateBefore: this.props.selectedFilters.dateBefore,
    };

    this.inputChange = this.inputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const updatedDateAfter = nextProps.selectedFilters.dateAfter;
    const updatedDateBefore = nextProps.selectedFilters.dateBefore;

    this.setState({
      dateAfter: updatedDateAfter,
      dateBefore: updatedDateBefore,
    });
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
      this.props.onDateFilterChange(displayValue, value);
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

    const defaultValueDateAfter = (this.state.dateAfter) ? this.state.dateAfter : null;
    const defaultValueDateBefore = (this.state.dateBefore) ? this.state.dateBefore : null;

    return (
      <fieldset>
        <legend>Date</legend>
        <div id="input-container">
          <label htmlFor="start-date" id="startDate-label">Start Year
            <NumberFormat
              id="start-date"
              name="start-date"
              className="form-text"
              onChange={this.inputChange}
              format="####"
              aria-labelledby="startDate-label dateInput-status"
              value={defaultValueDateAfter}
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
              value={defaultValueDateBefore}
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
  selectedFilters: PropTypes.object,
  onDateFilterChange: PropTypes.func,
};

FieldsetDate.defaultProps = {
  selectedFilters: {
    dateAfter: '',
    dateBefore: '',
  },
};

export default FieldsetDate;
