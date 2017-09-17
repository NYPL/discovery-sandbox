import React from 'react';
import PropTypes from 'prop-types';
import Actions from '../../actions/Actions.js';
import {
  extend as _extend,
} from 'underscore';
import NumberFormat from 'react-number-format';

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
          <label htmlFor="start-date">Start Year
            <NumberFormat
              id="start-date"
              name="start-date"
              className="form-text"
              onChange={this.inputChange}
              format="####"
            />
          </label>
          <label htmlFor="end-date">End Year
            <NumberFormat
              id="end-date"
              name="end-date"
              className="form-text"
              onChange={this.inputChange}
              format="####"
            />
          </label>
          <span>The Start year cannot be later than the end year</span>
          <br />
          <span id="error-message">{errorMessage}</span>
        </div>
      </fieldset>
    );
  }
}

FieldsetDate.propTypes = {
  selectedFacets: PropTypes.object,
};

export default FieldsetDate;
