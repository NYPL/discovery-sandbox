import { Heading } from '@nypl/design-system-react-components';
import React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';

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
    let errorMessage = 'The end year should be the same year as or later than the start year.';
    let errorClass = '';

    if (this.props.submitError) {
      errorMessage = 'Enter a valid range in the Start Year and End Year fields or remove what ' +
      'you\'ve entered from those fields.';
      errorClass = 'nypl-field-error';
    }

    const defaultValueDateAfter = (this.state.dateAfter) ? this.state.dateAfter : null;
    const defaultValueDateBefore = (this.state.dateBefore) ? this.state.dateBefore : null;

    return (
      <fieldset className="nypl-fieldset inner date-fieldset">
        <legend><Heading level="three">Date</Heading></legend>
        <div id="input-container" className={`nypl-name-field nypl-filter-date-field ${errorClass}`}>
          <label htmlFor="dateAfter" id="dateAfter-label">Start Year
            <NumericFormat
              id="dateAfter"
              name="dateAfter"
              className="form-text"
              onChange={this.inputChange}
              format="####"
              aria-labelledby="dateAfter-label dateInput-status"
              value={defaultValueDateAfter}
              placeholder="Ex: 1901"
            />
          </label>
          <span className="date-divider">to</span>
          <label htmlFor="dateBefore" id="dateBefore-label">End Year
            <NumericFormat
              id="dateBefore"
              name="dateBefore"
              className="form-text"
              onChange={this.inputChange}
              format="####"
              aria-labelledby="dateBefore-label dateInput-status"
              value={defaultValueDateBefore}
              placeholder="Ex: 2001"
            />
          </label>
          <span
            id="dateInput-status"
            className="nypl-field-status"
            aria-live="assertive"
            aria-atomic="true"
          >
            <span>
              {errorMessage}
            </span>
          </span>
        </div>
      </fieldset>
    );
  }
}

FieldsetDate.propTypes = {
  selectedFilters: PropTypes.object,
  onDateFilterChange: PropTypes.func,
  submitError: PropTypes.bool,
};

FieldsetDate.defaultProps = {
  selectedFilters: {
    dateAfter: '',
    dateBefore: '',
  },
};

export default FieldsetDate;
