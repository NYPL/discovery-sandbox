import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import appConfig from '../../../../appConfig';
import AutosuggestItem from './AutosuggestItem'

class SubjectHeadingSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      suggestions: [],
      userInput: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.clearUserInput = this.clearUserInput.bind(this)
    this.generatePath = this.generatePath.bind(this)
  }

  onSubmit(submitEvent) {
    submitEvent.preventDefault();
    const url = this.generatePath(this.state.suggestions[this.state.activeSuggestion])
    console.log(this.props, this.context);
    this.clearUserInput()
    this.context.router.push(url)
  }

  onChange(inputEvent) {
    const { suggestion } = this.state
    const userInput = inputEvent.currentTarget.value

    this.setState({
      userInput
    })

    if (userInput.length > 2) {
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

  }

  clearUserInput() {
    this.setState({
      userInput: ''
    })
  }

  generatePath(item) {
    const subfield = item.class === 'subfield'
    const base = appConfig.baseUrl
    if (subfield) {
      return `${base}/subject_headings?filter=${item.label}`
    } else if (item.uuid) {
      return `${base}/subject_headings/${item.uuid}`
    }
  }

  render() {
    const {
      onChange,
      onSubmit,
      state: {
        suggestions,
        activeSuggestion,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (userInput && suggestions.length) {
      suggestionsListComponent = (
        <ul className="suggestions">
        {suggestions.map((suggestion, index) => {
          return (
            <AutosuggestItem
              item={suggestion}
              generatePath={this.generatePath}
              activeSuggestion={index === activeSuggestion}
              key={suggestion.uuid || suggestion.label}
              location={location}
              onClick={this.clearUserInput}
            />
          )
        })}
        </ul>
      )
    }

    return (
      <form
        className="autocomplete"
        autoComplete="off"
        action="/action_page.php"
        onSubmit={onSubmit}
      >
        <div className="autocomplete-field">
          <label htmlFor="autosuggest">Subject Heading Search:</label>
          <input
            id="autosuggest"
            type="text"
            onChange={onChange}
            value={userInput}
            placeholder="Subject"
          />
          {suggestionsListComponent}
        </div>
      </form>
    )
  }
}

SubjectHeadingSearch.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingSearch
