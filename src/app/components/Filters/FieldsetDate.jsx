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
    const displayValue = e.target.name;

    if (displayValue) {
      if (displayValue === 'dateAfter' || displayValue === 'dateBefore') {
        this.props.onDateFilterChange(displayValue, value);
      }
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
      <fieldset className="nypl-fieldset inner">
        <legend>Date</legend>
        <div id="input-container" className="nypl-name-field nypl-filter-date-field">
          <label htmlFor="dateAfter" id="dateAfter-label">Start Year
            <NumberFormat
              id="dateAfter"
              name="dateAfter"
              className="form-text"
              onChange={this.inputChange}
              format="####"
              aria-labelledby="dateAfter-label dateInput-status"
              value={defaultValueDateAfter}
            />
          </label>
          <svg viewBox="0 0 98 98" className="nypl-icon" preserveAspectRatio="xMidYMid meet"  aria-hidden="true" aria-labelledby="dash" role="img">
            <title id="dash">dash.icon</title>
            <polygon points="72.996 54.95 25.002 54.95 25.003 45.991 72.994 46.011 72.996 54.95"/>
          </svg>
          <label htmlFor="dateBefore" id="dateBefore-label">End Year
            <NumberFormat
              id="dateBefore"
              name="dateBefore"
              className="form-text"
              onChange={this.inputChange}
              format="####"
              aria-labelledby="dateBefore-label dateInput-status"
              value={defaultValueDateBefore}
            />
          </label>
          {
            //<span>The Start year cannot be later than the end year</span>
          }
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
