import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import appConfig from '../../../appConfig';
import AutosuggestItem from './AutosuggestItem'

class SubjectHeadingSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      suggestions: [],
      userInput: '',
      showSuggestions: true
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.resetAutosuggest = this.resetAutosuggest.bind(this)
    this.changeActiveSuggestion = this.changeActiveSuggestion.bind(this)
    this.hideSuggestions = this.hideSuggestions.bind(this)
  }

  onSubmit(submitEvent) {
    submitEvent.preventDefault();
    const url = this.generatePath(this.state.suggestions[this.state.activeSuggestion])
    this.resetAutosuggest()
    this.context.router.push(url)
  }

  onChange(inputEvent) {
    const { suggestion } = this.state
    const userInput = inputEvent.currentTarget.value

    this.setState({
      userInput
    }, () => {
      axios({
        method: 'GET',
        url: `${appConfig.shepApi}/autosuggest?query=${userInput}`,
        crossDomain: true
      })
      .then(res => {
        this.setState({
          suggestions: res.data.autosuggest
        })
      })
    })
  }

  changeActiveSuggestion(keyEvent) {
    const {suggestions, activeSuggestion} = this.state
    if (suggestions.length > 0) {
      if (keyEvent.key === 'ArrowDown' && suggestions.length - 1 > activeSuggestion) {
        keyEvent.preventDefault();
        this.setState(prevState => {
          return {activeSuggestion: prevState.activeSuggestion += 1}
        })
      } else if (keyEvent.key === 'ArrowUp' && activeSuggestion > 0) {
        keyEvent.preventDefault();
        this.setState(prevState => {
          return {activeSuggestion: this.state.activeSuggestion -= 1}
        })
      }
    }
  }

  resetAutosuggest() {
    this.setState({
      userInput: '',
      activeSuggestion: 0,
      showSuggestions: true
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

  hideSuggestions(e) {
    e.preventDefault();
    if (e.relatedTarget && e.relatedTarget.className === 'extendAutosuggestFormFocus') {
      return;
    }
    this.setState({showSuggestions: false})
  }

  render() {
    const {
      onChange,
      onSubmit,
      changeActiveSuggestion,
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
        <ul className='suggestions'>
        {suggestions.map((suggestion, index) => {
          return (
            <AutosuggestItem
              item={suggestion}
              path={this.generatePath(suggestion)}
              activeSuggestion={index === activeSuggestion}
              key={suggestion.uuid || suggestion.label}
              location={location}
              onClick={this.resetAutosuggest}
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
        onSubmit={onSubmit}
        onKeyDown={changeActiveSuggestion}
        onBlur={this.hideSuggestions}
        onFocus={() => this.setState({showSuggestions: true})}
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
