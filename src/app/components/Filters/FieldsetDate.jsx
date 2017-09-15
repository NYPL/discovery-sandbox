import React from 'react';
import PropTypes from 'prop-types';
import Actions from '../../actions/Actions.js';
import {
  extend as _extend,
} from 'underscore';

class FieldsetDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateAfter: '0',
      dateBefore: '0',
      selectedFacets: this.props.selectedFacets,
    };

    this.inputChange = this.inputChange.bind(this);
  }

  /**
   * inputChange()
   * Updates the states and the store based on the input values.
   *
   */
  inputChange(e) {
    const value = (e.target.value).replace(/[a-zA-Z]/g, '');
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
          selectedFacets: _extend(
            this.state.selectedFacets,
            { [displayValue]: value }
          ),
        },
        () => {
          Actions.updateSelectedFacets(this.state.selectedFacets);
        }
      );
    }
  }

  render() {
    let errorMessage = '';

    if (this.state.endDateInput && this.state.startDateInput) {
      if (Number(this.state.endDateInput) < Number(this.state.startDateInput)) {
        errorMessage = 'end year should be later than start year.';
      }
    } else {
      errorMessage = '';
    }

    return (
      <fieldset>
        <legend>Date</legend>
        <div id="input-container">
          <label htmlFor="start-date">Start Year
            <input
              id="start-date"
              name="start-date"
              className="form-text"
              type="text"
              maxLength="4"
              onChange={this.inputChange}
            />
          </label>
          <label htmlFor="end-date">End Year
            <input
              id="end-date"
              name="end-date"
              className="form-text"
              type="text"
              maxLength="4"
              onChange={this.inputChange}
            />
          </label>
          <span>The Start year cannot be later than the end year</span>
          <br />
          <span>{errorMessage}</span>
        </div>
      </fieldset>
    );
  }
}

FieldsetDate.propTypes = {
  selectedFacets: PropTypes.object,
};

export default FieldsetDate;
