import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import appConfig from '../../../../appConfig';

class SubjectHeadingSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      suggestions: [],
      showSuggestions: true,
      userInput: ''
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange(inputEvent) {
    const { suggestion } = this.state
    const userInput = inputEvent.currentTarget.value

    this.setState({
      userInput,
    })

    axios({
      method: 'GET',
      url: `${appConfig.shepApi}/autosuggest?query=${userInput}`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      this.setState({
        suggestions: res.data.autosuggest
      })
    })
  }

  render() {
    const {
      onChange,
      state: {
        suggestions,
        activeSuggestion,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (suggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
          {suggestions.map((suggestion, index) => {
            let className = "suggestion"
            if (index === activeSuggestion) {
              className += "-active"
            }
            return (
              <li
                className={`${className} ${suggestion.class}`}
                key={suggestion.label}
              >
                {suggestion.label}
              </li>
            )
          })}
          </ul>
        )
      }
    }

    return (
      <form className="autocomplete" autoComplete="off" action="/action_page.php">
        <div className="autocomplete-field">
          <input
            id="myInput"
            type="text"
            onChange={onChange}
            value={userInput}
            placeholder="Subject"
          />
          {suggestionsListComponent}
        </div>
        <input type="submit"/>
      </form>
    )
  }
}

export default SubjectHeadingSearch
